import { PrismaTransaction } from '#server/prisma';
import { ONLY_NUTRIENTS_SELECT } from '#server/selectors/food';
import {
  FoodMealIngredientType,
  FoodNutrients,
  multiplyNutrients,
  sumNutrients,
} from '#shared/models/food';
import { nonReachable } from '#shared/utils';

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
    arg: {
      ingredientType: FoodMealIngredientType;
      ingredientId: string;
      quantityConverterId: string;
      quantity: number;
    },
    trx: PrismaTransaction,
  ) {
    const grams = await trx.foodQuantityConverter
      .findFirstOrThrow({
        where: { id: arg.quantityConverterId },
        select: { grams: true },
      })
      .then(data => data.grams * arg.quantity);

    if (arg.ingredientType === 'product') {
      const nutrients = await trx.foodNutrients
        .findFirstOrThrow({
          where: { product: { id: arg.ingredientId } },
          ...ONLY_NUTRIENTS_SELECT,
        })
        .then(data => multiplyNutrients(data, grams));

      return await trx.foodNutrients.create({
        data: nutrients,
      });
    } else if (arg.ingredientType === 'recipe') {
      const nutrients = await trx.foodNutrients
        .findFirstOrThrow({
          where: { recipe: { id: arg.ingredientId } },
          ...ONLY_NUTRIENTS_SELECT,
        })
        .then(data => multiplyNutrients(data, grams));

      return await trx.foodNutrients.create({
        data: nutrients,
      });
    } else {
      nonReachable(arg.ingredientType);
    }
  }
}

export default new FoodNutrientsService();
