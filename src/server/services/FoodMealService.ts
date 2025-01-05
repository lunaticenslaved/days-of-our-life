import { PrismaTransaction } from '#/server/prisma';
import {
  convertFoodMealItemSelector,
  FOOD_MEAL_ITEM_SELECTOR,
} from '#/server/selectors/food';
import FoodNutrientsService from '#/server/services/FoodNutrientsService';

interface CreateMealItemArg {
  dayId: string;
  dayPartId: string;
  quantityConverterId: string;
  quantity: number;
  item:
    | {
        type: 'product';
        productId: string;
      }
    | {
        type: 'recipe';
        recipeId: string;
      };
}

class FoodMealService {
  async create(
    { dayId, dayPartId, item, quantityConverterId, quantity }: CreateMealItemArg,
    trx: PrismaTransaction,
  ) {
    const { id: nutrientsId } = await FoodNutrientsService.createForIngredientAndQuantity(
      {
        quantityConverterId,
        quantity,
        item,
      },
      trx,
    );

    return await trx.foodMealItem
      .create({
        data: {
          dayId,
          dayPartId,
          nutrientsId,
          productId: item.type === 'product' ? item.productId : undefined,
          recipeId: item.type === 'recipe' ? item.recipeId : undefined,
          quantity,
          quantityConverterId,
        },
        ...FOOD_MEAL_ITEM_SELECTOR,
      })
      .then(convertFoodMealItemSelector);
  }

  async update(
    {
      mealItemId,
      dayId,
      dayPartId,
      item,
      quantityConverterId,
      quantity,
    }: CreateMealItemArg & { mealItemId: string },
    trx: PrismaTransaction,
  ) {
    const mealItem = trx.foodMealItem.findFirstOrThrow({
      where: { id: mealItemId },
      select: {
        nutrientsId: true,
      },
    });

    const { id: nutrientsId } = await FoodNutrientsService.createForIngredientAndQuantity(
      {
        quantityConverterId,
        quantity,
        item,
      },
      trx,
    );

    const updated = await trx.foodMealItem
      .update({
        where: {
          id: mealItemId,
        },
        data: {
          dayId,
          dayPartId,
          nutrientsId,
          productId: item.type === 'product' ? item.productId : undefined,
          recipeId: item.type === 'recipe' ? item.recipeId : undefined,
          quantity,
          quantityConverterId,
        },
        ...FOOD_MEAL_ITEM_SELECTOR,
      })
      .then(convertFoodMealItemSelector);

    await trx.foodNutrients.delete({
      where: { id: (await mealItem).nutrientsId },
    });

    return updated;
  }

  async delete({ mealItemId }: { mealItemId: string }, trx: PrismaTransaction) {
    await trx.foodMealItem.delete({
      where: { id: mealItemId },
    });
  }

  async list({ dayId }: { dayId: string }, trx: PrismaTransaction) {
    return await trx.foodMealItem
      .findMany({
        where: {
          dayId,
        },
        ...FOOD_MEAL_ITEM_SELECTOR,
      })
      .then(items => items.map(convertFoodMealItemSelector));
  }
}

export default new FoodMealService();
