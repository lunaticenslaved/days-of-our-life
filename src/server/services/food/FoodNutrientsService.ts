import { PrismaTransaction } from '#/server/prisma';
import { ONLY_NUTRIENTS_SELECT } from '#/server/selectors/food';
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

  async createForIngredientAndQuantity(
    {
      item,
      ...arg
    }: {
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
    },
    trx: PrismaTransaction,
  ) {
    const grams = await trx.foodQuantityConverter
      .findFirstOrThrow({
        where: { id: arg.quantityConverterId },
        select: { grams: true },
      })
      .then(data => data.grams * arg.quantity);

    if (item.type === 'product') {
      const nutrients = await trx.foodNutrients
        .findFirstOrThrow({
          where: { product: { id: item.productId } },
          ...ONLY_NUTRIENTS_SELECT,
        })
        .then(data => multiplyNutrients(data, grams));

      return await trx.foodNutrients.create({
        data: nutrients,
      });
    } else if (item.type === 'recipe') {
      const nutrients = await trx.foodNutrients
        .findFirstOrThrow({
          where: { recipe: { id: item.recipeId } },
          ...ONLY_NUTRIENTS_SELECT,
        })
        .then(data => multiplyNutrients(data, grams));

      return await trx.foodNutrients.create({
        data: nutrients,
      });
    } else {
      nonReachable(item);
    }
  }
}

export default new FoodNutrientsService();
