import { convertFoodTrackerDay, SELECT_TRACKER_DAY } from '#server/selectors/food';
import FoodNutrientsService from '#server/services/FoodNutrientsService';
import { Controller } from '#server/utils/Controller';
import {
  AddFoodMeadIngredientRequest,
  AddFoodMeadIngredientResponse,
  GetFoodTrackerDayResponse,
  GetFoodTrackerDayRequest,
} from '#shared/api/types/food';
import dayjs from '#shared/libs/dayjs';

export default new Controller<'food/tracker'>({
  'POST /food/tracker/meals': Controller.handler<
    AddFoodMeadIngredientRequest,
    AddFoodMeadIngredientResponse
  >({
    parse: req => req.body,
    handler: ({ date: dateProp, ingredient, quantity, quantityType }, { prisma }) => {
      return prisma.$transaction(async trx => {
        const date = dayjs(dateProp, { utc: true }).startOf('day').toISOString();

        const day = await trx.foodTrackerDay.upsert({
          where: { date },
          create: { date },
          update: {},
        });

        if (quantityType !== 'gram') {
          throw new Error('Not implemented');
        }

        if (ingredient.type === 'recipe') {
          throw new Error('Not implemented'); // FIXME
        }

        const nutrients = await FoodNutrientsService.calculate(
          [{ productId: ingredient.productId, grams: quantity }],
          trx,
        );

        const { id } = await trx.foodNutrients.create({ data: nutrients });

        await trx.foodTrackerMealItem.create({
          data: {
            dayId: day.id,
            productId: ingredient.productId,
            nutrientsId: id,
            quantity,
            quantityType,
          },
        });
      });
    },
  }),

  'GET /food/tracker/days/:date': Controller.handler<
    GetFoodTrackerDayRequest,
    GetFoodTrackerDayResponse
  >({
    parse: req => ({ date: req.params.date as string }),
    handler: async ({ date: dateProp }, { prisma }) => {
      const date = dayjs(dateProp, { utc: true }).startOf('day').toISOString();

      const day = await prisma.foodTrackerDay.findFirst({
        where: { date },
        ...SELECT_TRACKER_DAY,
      });

      if (day) {
        return convertFoodTrackerDay(day);
      }

      return await prisma.foodTrackerDay
        .create({
          data: { date },
          ...SELECT_TRACKER_DAY,
        })
        .then(convertFoodTrackerDay);
    },
  }),
});
