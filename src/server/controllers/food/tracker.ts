import { convertFoodTrackerDay, SELECT_TRACKER_DAY } from '#server/selectors/food';
import FoodNutrientsService from '#server/services/FoodNutrientsService';
import FoodTrackerDayService from '#server/services/FoodTrackerDayService';
import { Controller } from '#server/utils/Controller';
import {
  CreateFoodMealItemRequest,
  CreateFoodMealItemResponse,
  GetFoodTrackerDayResponse,
  GetFoodTrackerDayRequest,
  UpdateFoodMealItemRequest,
  UpdateFoodMealItemResponse,
  DeleteFoodMealItemRequest,
  DeleteFoodMealItemResponse,
} from '#shared/api/types/food';
import { CommonValidators } from '#shared/models/common';
import { FoodValidators } from '#shared/models/food';
import { z } from 'zod';

const CreateFoodMealItemValidator: z.ZodType<CreateFoodMealItemRequest> = z.object({
  quantityType: FoodValidators.quantityType,
  quantity: FoodValidators.quantity,
  date: CommonValidators.date,
  ingredient: z.object({
    type: z.union([z.literal('product'), z.literal('recipe')]),
    id: CommonValidators.id,
  }),
});

export default new Controller<'food/tracker'>({
  'POST /food/tracker/days/:date/meals/items': Controller.handler<
    CreateFoodMealItemRequest,
    CreateFoodMealItemResponse
  >({
    validator: CreateFoodMealItemValidator,
    parse: req => ({ ...req.body, date: req.params.date }),
    handler: ({ date: dateProp, ingredient, quantity, quantityType }, { prisma }) => {
      return prisma.$transaction(async trx => {
        const day = await FoodTrackerDayService.getDay(dateProp, trx);

        if (quantityType !== 'gram') {
          throw new Error('Not implemented');
        }

        if (ingredient.type === 'recipe') {
          throw new Error('Not implemented'); // FIXME
        }

        const nutrients = await FoodNutrientsService.calculate(
          [{ productId: ingredient.id, grams: quantity }],
          trx,
        );

        const { id } = await trx.foodNutrients.create({ data: nutrients });

        await trx.foodTrackerMealItem.create({
          data: {
            dayId: day.id,
            productId: ingredient.id,
            nutrientsId: id,
            quantity,
            quantityType,
          },
        });
      });
    },
  }),

  'PATCH /food/tracker/days/:date/meals/items/:itemId': Controller.handler<
    UpdateFoodMealItemRequest,
    UpdateFoodMealItemResponse
  >({
    validator: CreateFoodMealItemValidator.and(z.object({ itemId: CommonValidators.id })),
    parse: req => ({ ...req.body, itemId: req.params.itemId }),
    handler: (
      { date: dateProp, ingredient, quantity, quantityType, itemId },
      { prisma },
    ) => {
      return prisma.$transaction(async trx => {
        const day = await FoodTrackerDayService.getDay(dateProp, trx);

        if (quantityType !== 'gram') {
          throw new Error('Not implemented');
        }

        if (ingredient.type === 'recipe') {
          throw new Error('Not implemented'); // FIXME
        }

        const nutrients = await FoodNutrientsService.calculate(
          [{ productId: ingredient.id, grams: quantity }],
          trx,
        );

        const oldNutrients = await trx.foodNutrients.findFirst({
          where: { trackerMealItem: { id: itemId } },
        });
        const { id } = await trx.foodNutrients.create({ data: nutrients });

        const data = {
          dayId: day.id,
          productId: ingredient.id,
          nutrientsId: id,
          quantity,
          quantityType,
        };

        await trx.foodTrackerMealItem.upsert({
          where: { id: itemId },
          create: data,
          update: data,
        });

        if (oldNutrients) {
          await trx.foodNutrients.deleteMany({ where: { id: oldNutrients.id } });
        }
      });
    },
  }),

  'DELETE /food/tracker/days/:date/meals/items/:itemId': Controller.handler<
    DeleteFoodMealItemRequest,
    DeleteFoodMealItemResponse
  >({
    validator: z.object({ itemId: CommonValidators.id, date: CommonValidators.date }),
    parse: req => ({ date: req.params.date, itemId: req.params.itemId }),
    handler: ({ itemId }, { prisma }) => {
      return prisma.$transaction(async trx => {
        await trx.foodTrackerMealItem.deleteMany({
          where: { id: itemId },
        });
        await trx.foodNutrients.deleteMany({
          where: { trackerMealItem: { id: itemId } },
        });
      });
    },
  }),

  'GET /food/tracker/days/:date': Controller.handler<
    GetFoodTrackerDayRequest,
    GetFoodTrackerDayResponse
  >({
    validator: z.object({ date: CommonValidators.date }),
    parse: req => ({ date: req.params.date as string }),
    handler: async ({ date }, { prisma }) => {
      return prisma.$transaction(async trx => {
        const { id } = await FoodTrackerDayService.getDay(date, trx);

        return await trx.foodTrackerDay
          .findFirstOrThrow({
            where: { id },
            ...SELECT_TRACKER_DAY,
          })
          .then(convertFoodTrackerDay);
      });
    },
  }),
});
