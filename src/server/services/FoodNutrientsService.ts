import { PrismaTransaction } from '#server/prisma';
import { FoodNutrients } from '#shared/models/food';

class FoodNutrientsService {
  async calculate(
    ingredients: Array<{ productId: string; grams: number }>,
    trx: PrismaTransaction,
  ): Promise<FoodNutrients> {
    const products = await trx.foodProduct.findMany({
      where: { id: { in: ingredients.map(p => p.productId) } },
      select: { nutrientsPerGram: true, id: true },
    });

    let calories = 0;
    let fats = 0;
    let proteins = 0;
    let carbs = 0;
    let fibers = 0;

    for (const ingredient of ingredients) {
      const product = products.find(({ id }) => ingredient.productId === id);

      if (!product) {
        throw new Error('Unknown product');
      }

      const { nutrientsPerGram } = product;
      const { grams } = ingredient;

      calories += nutrientsPerGram.calories * grams;
      fats += nutrientsPerGram.fats * grams;
      proteins += nutrientsPerGram.proteins * grams;
      carbs += nutrientsPerGram.carbs * grams;
      fibers += nutrientsPerGram.fibers * grams;
    }

    return {
      calories,
      fats,
      proteins,
      carbs,
      fibers,
    };
  }

  divide(nutrients: FoodNutrients, divider: number) {
    return {
      calories: nutrients.calories / divider,
      fats: nutrients.fats / divider,
      proteins: nutrients.proteins / divider,
      carbs: nutrients.carbs / divider,
      fibers: nutrients.fibers / divider,
    };
  }
}

export default new FoodNutrientsService();
