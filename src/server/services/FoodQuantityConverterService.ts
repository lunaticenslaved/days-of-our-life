import { PrismaTransaction } from '#server/prisma';

type InsertArg =
  | {
      productId: string;
    }
  | {
      recipeId: string;
      grams: number;
      servings: number;
    };

class FoodQuantityConverterService {
  async insert(arg: InsertArg, trx: PrismaTransaction) {
    if ('productId' in arg) {
      // FIXME не удалять их или апдейтить все места, где оно используется
      await trx.foodQuantityConverter.deleteMany({
        where: { productId: arg.productId },
      });

      await trx.foodQuantityConverter.create({
        data: {
          productId: arg.productId,
          grams: 1,
          name: 'Граммы',
        },
      });
    } else {
      const { recipeId, grams, servings } = arg;

      // FIXME не удалять их или апдейтить все места, где оно используется
      await trx.foodQuantityConverter.deleteMany({
        where: { recipeId },
      });

      await trx.foodQuantityConverter.create({
        data: {
          recipeId,
          grams: grams / servings,
          name: 'Порция',
        },
      });
      await trx.foodQuantityConverter.create({
        data: {
          recipeId,
          grams: 1,
          name: 'Граммы',
        },
      });
    }
  }
}

export default new FoodQuantityConverterService();
