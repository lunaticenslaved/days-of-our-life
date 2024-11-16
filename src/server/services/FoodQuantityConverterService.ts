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
    // TODO перенести куда-то в константы названия

    const currentConvertersId: string[] = [];

    if ('productId' in arg) {
      const { productId } = arg;
      const convertsToCreate = [{ name: 'Граммы', grams: 1, productId }];

      for (const converter of convertsToCreate) {
        const existing = await trx.foodQuantityConverter.findFirst({
          where: { grams: converter.grams, productId, name: converter.name },
        });

        if (existing) {
          currentConvertersId.push(existing.id);
        } else {
          const { id } = await trx.foodQuantityConverter.create({
            data: converter,
          });

          currentConvertersId.push(id);
        }
      }

      await trx.foodQuantityConverter.updateMany({
        where: { id: { in: currentConvertersId } },
        data: { isDeleted: false },
      });

      await trx.foodQuantityConverter.updateMany({
        where: { id: { notIn: currentConvertersId }, productId },
        data: { isDeleted: true },
      });
    } else {
      const { recipeId, grams, servings } = arg;
      const convertsToCreate = [
        { name: 'Граммы', grams: 1, recipeId },
        { recipeId, grams: grams / servings, name: 'Порция' },
      ];

      for (const converter of convertsToCreate) {
        const existing = await trx.foodQuantityConverter.findFirst({
          where: { grams: converter.grams, recipeId, name: converter.name },
        });

        if (existing) {
          currentConvertersId.push(existing.id);
        } else {
          const { id } = await trx.foodQuantityConverter.create({
            data: converter,
          });

          currentConvertersId.push(id);
        }

        await trx.foodQuantityConverter.updateMany({
          where: { id: { in: currentConvertersId } },
          data: { isDeleted: false },
        });

        await trx.foodQuantityConverter.updateMany({
          where: { id: { notIn: currentConvertersId }, recipeId },
          data: { isDeleted: true },
        });
      }
    }
  }
}

export default new FoodQuantityConverterService();
