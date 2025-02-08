import { PrismaTransaction } from '#/server/prisma';
import {
  convertFoodMealItemSelector,
  FOOD_MEAL_ITEM_SELECTOR,
} from '#/server/selectors/food';
import FoodNutrientsService from '#/server/services/food/FoodNutrientsService';
import { FoodMealItem } from '#/shared/models/food';

interface CreateMealItemArg {
  dayId: string;
  dayPartId: string;
  quantity: {
    value: number;
    converterId: string;
  };
  food:
    | {
        type: 'product';
        productId: string;
      }
    | {
        type: 'recipe';
        recipeId: string;
      };
}

class FoodMealItemService {
  async create(data: CreateMealItemArg, trx: PrismaTransaction): Promise<FoodMealItem> {
    const { food, dayId, dayPartId, quantity } = data;

    const { id: nutrientsId } = await FoodNutrientsService.calculateForFood(
      {
        food,
        quantity: quantity.value,
        quantityConverterId: quantity.converterId,
      },
      trx,
    ).then(nutrients => FoodNutrientsService.create(nutrients, trx));

    return await trx.foodMealItem
      .create({
        data: {
          dayId,
          dayPartId,
          nutrientsId,
          productId: food.type === 'product' ? food.productId : undefined,
          recipeId: food.type === 'recipe' ? food.recipeId : undefined,
          quantity: quantity.value,
          quantityConverterId: quantity.converterId,
        },
        ...FOOD_MEAL_ITEM_SELECTOR,
      })
      .then(convertFoodMealItemSelector);
  }

  async update(
    data: CreateMealItemArg & { id: string },
    trx: PrismaTransaction,
  ): Promise<FoodMealItem> {
    const { id, dayId, dayPartId, food: item, quantity } = data;
    const mealItem = await trx.foodMealItem.findFirstOrThrow({
      where: { id },
      select: {
        nutrientsId: true,
      },
    });

    const { id: nutrientsId } = await FoodNutrientsService.calculateForFood(
      {
        food: item,
        quantity: quantity.value,
        quantityConverterId: quantity.converterId,
      },
      trx,
    ).then(nutrients => FoodNutrientsService.create(nutrients, trx));

    const updated = await trx.foodMealItem
      .update({
        where: {
          id,
        },
        data: {
          dayId,
          dayPartId,
          nutrientsId,
          productId: item.type === 'product' ? item.productId : undefined,
          recipeId: item.type === 'recipe' ? item.recipeId : undefined,
          quantity: data.quantity.value,
          quantityConverterId: data.quantity.converterId,
        },
        ...FOOD_MEAL_ITEM_SELECTOR,
      })
      .then(convertFoodMealItemSelector);

    await trx.foodNutrients.delete({
      where: { id: mealItem.nutrientsId },
    });

    return updated;
  }

  async delete({ id }: { id: string }, trx: PrismaTransaction): Promise<void> {
    await trx.foodMealItem.delete({
      where: { id },
    });
  }

  async get({ id }: { id: string }, trx: PrismaTransaction): Promise<FoodMealItem> {
    return await trx.foodMealItem
      .findFirstOrThrow({
        where: { id },
        ...FOOD_MEAL_ITEM_SELECTOR,
      })
      .then(convertFoodMealItemSelector);
  }

  async list(
    { dayId }: { dayId: string },
    trx: PrismaTransaction,
  ): Promise<FoodMealItem[]> {
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

export default new FoodMealItemService();
