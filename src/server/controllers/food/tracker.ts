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
import { nonReachable } from '#shared/utils';
import { z } from 'zod';

const CreateFoodMealItemValidator: z.ZodType<CreateFoodMealItemRequest> = z.object({
  quantityConverterId: FoodValidators.quantityConverterId,
  quantity: FoodValidators.quantity,
  date: CommonValidators.date,
  ingredient: z.object({
    type: FoodValidators.mealItemSource,
    id: CommonValidators.id,
  }),
});

function getIngredientByType(ingredient: CreateFoodMealItemRequest['ingredient']) {
  if (ingredient.type === 'product') {
    return {
      productId: ingredient.id,
    };
  } else if (ingredient.type === 'recipe') {
    return {
      recipeId: ingredient.id,
    };
  } else {
    nonReachable(ingredient.type);
  }
}

export default new Controller<'food/tracker'>({
  'POST /food/tracker/days/:date/meals/items': Controller.handler<
    CreateFoodMealItemRequest,
    CreateFoodMealItemResponse
  >({
    validator: CreateFoodMealItemValidator,
    parse: req => ({ ...req.body, date: req.params.date }),
    handler: (
      { date: dateProp, ingredient, quantity, quantityConverterId },
      { prisma },
    ) => {
      return prisma.$transaction(async trx => {
        const day = await FoodTrackerDayService.getDay(dateProp, trx);

        const { id: nutrientsId } =
          await FoodNutrientsService.createForIngredientAndQuantity(
            {
              quantityConverterId,
              quantity,
              ingredientType: ingredient.type,
              ingredientId: ingredient.id,
            },
            trx,
          );

        await trx.foodTrackerMealItem.create({
          data: {
            dayId: day.id,
            nutrientsId,
            quantity,
            quantityConverterId,
            ...getIngredientByType(ingredient),
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
      { date: dateProp, ingredient, quantity, quantityConverterId, itemId },
      { prisma },
    ) => {
      return prisma.$transaction(async trx => {
        const day = await FoodTrackerDayService.getDay(dateProp, trx);

        await trx.foodTrackerMealItem.deleteMany({ where: { id: itemId } });
        await trx.foodNutrients.deleteMany({
          where: { trackerMealItem: { id: itemId } },
        });

        const { id: nutrientsId } =
          await FoodNutrientsService.createForIngredientAndQuantity(
            {
              quantityConverterId,
              quantity,
              ingredientType: ingredient.type,
              ingredientId: ingredient.id,
            },
            trx,
          );

        await trx.foodTrackerMealItem.create({
          data: {
            dayId: day.id,
            nutrientsId,
            quantity,
            quantityConverterId,
            ...getIngredientByType(ingredient),
          },
        });
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
