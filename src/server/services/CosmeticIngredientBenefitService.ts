import { PrismaTransaction } from '#/server/prisma';
import { CosmeticIngredientBenefit } from '#/shared/models/cosmetic';
import {
  convertCosmeticIngredientBenefitSelector,
  COSMETIC_INGREDIENT_BENEFIT_SELECTOR,
} from '#/server/selectors/cosmetic';

// FIXME check recursive tree

class CosmeticBenefitService {
  async create(
    arg: { name: string; parentId?: string },
    trx: PrismaTransaction,
  ): Promise<CosmeticIngredientBenefit> {
    return trx.cosmeticIngredientBenefit
      .create({
        data: {
          name: arg.name,
          parentId: arg.parentId,
        },
        ...COSMETIC_INGREDIENT_BENEFIT_SELECTOR,
      })
      .then(convertCosmeticIngredientBenefitSelector);
  }

  async update(
    arg: {
      id: string;
      name: string;
      parentId?: string;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticIngredientBenefit> {
    return trx.cosmeticIngredientBenefit
      .update({
        where: {
          id: arg.id,
        },
        data: {
          name: arg.name,
          parentId: arg.parentId,
        },
        ...COSMETIC_INGREDIENT_BENEFIT_SELECTOR,
      })
      .then(convertCosmeticIngredientBenefitSelector);
  }

  async delete(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ) {
    await trx.cosmeticIngredientBenefit.delete({
      where: { id: arg.id },
    });
  }

  async get(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticIngredientBenefit> {
    return await trx.cosmeticIngredientBenefit
      .findFirstOrThrow({
        where: { id: arg.id },
        ...COSMETIC_INGREDIENT_BENEFIT_SELECTOR,
      })
      .then(convertCosmeticIngredientBenefitSelector);
  }

  async list(
    _arg: unknown,
    trx: PrismaTransaction,
  ): Promise<CosmeticIngredientBenefit[]> {
    return await trx.cosmeticIngredientBenefit
      .findMany({
        ...COSMETIC_INGREDIENT_BENEFIT_SELECTOR,
      })
      .then(items => items.map(convertCosmeticIngredientBenefitSelector));
  }
}

export default new CosmeticBenefitService();
