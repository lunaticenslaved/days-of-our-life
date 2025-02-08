import { PrismaTransaction } from '#/server/prisma';
import { NUTRIENTS_WITH_ID_SELECT, ONLY_NUTRIENTS_SELECT } from '#/server/selectors/food';
import { FoodNutrients, multiplyNutrients, sumNutrients } from '#/shared/models/food';
import { nonReachable } from '#/shared/utils';

class FoodNutrientsService {
  async calculate(
    ingredients: Array<{ productId: string; grams: number }>,
    trx: PrismaTransaction,
  ): Promise<FoodNutrients> {
    const products = await trx.foodProduct.findMany({
      where: { id: { in: ingredients.map(p => p.productId) } },
      select: { nutrientsPerGram: true, id: true },
    });

    const items: FoodNutrients[] = [];

    for (const ingredient of ingredients) {
      const product = products.find(({ id }) => ingredient.productId === id);

      if (!product) {
        throw new Error('Unknown product');
      }

      const { nutrientsPerGram } = product;
      const { grams } = ingredient;

      items.push(multiplyNutrients(nutrientsPerGram, grams));
    }

    return sumNutrients(items);
  }

  async calculateForFood(
    {
      food,
      ...arg
    }: {
      quantityConverterId: string;
      quantity: number;
      food:
        | {
            type: 'product';
            productId: string;
          }
        | {
            type: 'recipe';
            recipeId: string;
          };
    },
    trx: PrismaTransaction,
  ) {
    const grams = await trx.foodQuantityConverter
      .findFirstOrThrow({
        where: { id: arg.quantityConverterId },
        select: { grams: true },
      })
      .then(data => data.grams * arg.quantity);

    if (food.type === 'product') {
      return await trx.foodNutrients
        .findFirstOrThrow({
          where: { product: { id: food.productId } },
          ...ONLY_NUTRIENTS_SELECT,
        })
        .then(data => multiplyNutrients(data, grams));
    } else if (food.type === 'recipe') {
      return await trx.foodNutrients
        .findFirstOrThrow({
          where: { recipe: { id: food.recipeId } },
          ...ONLY_NUTRIENTS_SELECT,
        })
        .then(data => multiplyNutrients(data, grams));
    } else {
      nonReachable(food);
    }
  }

  async create(
    data: FoodNutrients,
    trx: PrismaTransaction,
  ): Promise<FoodNutrients & { id: string }> {
    return trx.foodNutrients.create({
      data,
      ...NUTRIENTS_WITH_ID_SELECT,
    });
  }
}

export default new FoodNutrientsService();
