import { PrismaTransaction } from '#/server/prisma';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import {
  convertCosmeticINCIIngredientSelector,
  COSMETIC_INCI_INGREDIENT_SELECTOR,
} from '#/server/selectors/cosmetic';

interface InsertRequest {
  name: string;
  benefitIds: string[];
}

class CosmeticINCIIngredientService {
  async create(
    arg: InsertRequest,
    trx: PrismaTransaction,
  ): Promise<CosmeticINCIIngredient> {
    return trx.cosmeticINCIIngredient
      .create({
        data: {
          name: arg.name,
          benefits: {
            connect: arg.benefitIds.map(id => ({ id })),
          },
        },
        ...COSMETIC_INCI_INGREDIENT_SELECTOR,
      })
      .then(convertCosmeticINCIIngredientSelector);
  }

  async update(
    arg: InsertRequest & { id: string },
    trx: PrismaTransaction,
  ): Promise<CosmeticINCIIngredient> {
    return trx.cosmeticINCIIngredient
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
        ...COSMETIC_INCI_INGREDIENT_SELECTOR,
      })
      .then(convertCosmeticINCIIngredientSelector);
  }

  async delete(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ) {
    await trx.cosmeticINCIIngredient.delete({
      where: { id: arg.id },
    });
  }

  async get(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticINCIIngredient> {
    return await trx.cosmeticINCIIngredient
      .findFirstOrThrow({
        where: { id: arg.id },
        ...COSMETIC_INCI_INGREDIENT_SELECTOR,
      })
      .then(convertCosmeticINCIIngredientSelector);
  }

  async list(_arg: unknown, trx: PrismaTransaction): Promise<CosmeticINCIIngredient[]> {
    return await trx.cosmeticINCIIngredient
      .findMany({
        ...COSMETIC_INCI_INGREDIENT_SELECTOR,
      })
      .then(items => items.map(convertCosmeticINCIIngredientSelector));
  }
}

export default new CosmeticINCIIngredientService();
