import { PrismaTransaction } from '#/server/prisma';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import {
  convertCosmeticIngredientSelector,
  COSMETIC_INGREDIENT_SELECTOR,
} from '#/server/selectors/cosmetic';

class CosmeticIngredientService {
  async create(
    arg: { name: string; benefitIds: string[] },
    trx: PrismaTransaction,
  ): Promise<CosmeticIngredient> {
    return trx.cosmeticIngredient
      .create({
        data: {
          name: arg.name,
          benefits: {
            connect: arg.benefitIds.map(id => ({ id })),
          },
        },
        ...COSMETIC_INGREDIENT_SELECTOR,
      })
      .then(convertCosmeticIngredientSelector);
  }

  async update(
    arg: {
      id: string;
      name: string;
      benefitIds: string[];
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticIngredient> {
    return trx.cosmeticIngredient
      .update({
        where: {
          id: arg.id,
        },
        data: {
          name: arg.name,
          benefits: {
            set: arg.benefitIds.map(id => ({ id })),
          },
        },
        ...COSMETIC_INGREDIENT_SELECTOR,
      })
      .then(convertCosmeticIngredientSelector);
  }

  async delete(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ) {
    await trx.cosmeticIngredient.delete({
      where: { id: arg.id },
    });
  }

  async get(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticIngredient> {
    return await trx.cosmeticIngredient
      .findFirstOrThrow({
        where: { id: arg.id },
        ...COSMETIC_INGREDIENT_SELECTOR,
      })
      .then(convertCosmeticIngredientSelector);
  }

  async list(_arg: unknown, trx: PrismaTransaction): Promise<CosmeticIngredient[]> {
    return await trx.cosmeticIngredient
      .findMany({
        ...COSMETIC_INGREDIENT_SELECTOR,
      })
      .then(items => items.map(convertCosmeticIngredientSelector));
  }
}

export default new CosmeticIngredientService();
