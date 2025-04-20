import { PrismaTransaction } from '#/server/prisma';
import {
  convertCosmeticApplciationSelector,
  COSMETIC_APPLICATION_SELECTOR,
} from '#/server/selectors/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { DateFormat, DateUtils } from '#/shared/models/date';

class CosmeticBenefitService {
  async create(
    arg: {
      dayId: string;
      dayPartId: string;
      productId: string | null;
      recipeId: string | null;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticApplication> {
    if (!arg.productId && !arg.recipeId) {
      throw new Error('Either product or recipe must be selected!');
    }

    const order = await trx.cosmeticApplication.count({
      where: {
        dayId: arg.dayId,
        dayPartId: arg.dayPartId,
      },
    });

    return await trx.cosmeticApplication
      .create({
        data: {
          dayId: arg.dayId,
          dayPartId: arg.dayPartId,
          productId: arg.productId || undefined,
          recipeId: arg.recipeId || undefined,
          order,
        },
        ...COSMETIC_APPLICATION_SELECTOR,
      })
      .then(convertCosmeticApplciationSelector);
  }

  async update(
    arg: {
      id: string;
      dayId: string;
      dayPartId: string;
      productId: string | null;
      recipeId: string | null;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticApplication> {
    if (!arg.productId && !arg.recipeId) {
      throw new Error('Either product or recipe must be selected!');
    }

    return await trx.cosmeticApplication
      .update({
        where: {
          id: arg.id,
        },
        data: {
          dayId: arg.dayId,
          dayPartId: arg.dayPartId,
          productId: arg.productId || undefined,
          recipeId: arg.recipeId || undefined,
        },
        ...COSMETIC_APPLICATION_SELECTOR,
      })
      .then(convertCosmeticApplciationSelector);
  }

  async delete(arg: { id: string }, trx: PrismaTransaction): Promise<void> {
    await trx.cosmeticApplication.deleteMany({
      where: { id: arg.id },
    });
  }

  async get(arg: { id: string }, trx: PrismaTransaction): Promise<CosmeticApplication> {
    return await trx.cosmeticApplication
      .findFirstOrThrow({
        where: { id: arg.id },
        ...COSMETIC_APPLICATION_SELECTOR,
      })
      .then(convertCosmeticApplciationSelector);
  }

  async list(
    arg: {
      startDate: DateFormat;
      endDate: DateFormat;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticApplication[]> {
    return await trx.cosmeticApplication
      .findMany({
        where: {
          day: {
            date: {
              gte: DateUtils.fromDateFormat(arg.startDate),
              lte: DateUtils.fromDateFormat(arg.endDate),
            },
          },
        },
        ...COSMETIC_APPLICATION_SELECTOR,
        orderBy: [
          {
            order: 'asc',
          },
        ],
      })
      .then(items => items.map(convertCosmeticApplciationSelector));
  }

  async order(
    arg: {
      items: Array<{ id: string }>;
    },
    trx: PrismaTransaction,
  ) {
    for (let i = 0; i < arg.items.length; i++) {
      const { id } = arg.items[i];

      await trx.cosmeticApplication.update({
        where: { id },
        data: {
          order: i,
        },
      });
    }
  }
}

export default new CosmeticBenefitService();
