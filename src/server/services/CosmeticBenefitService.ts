import { PrismaTransaction } from '#/server/prisma';
import { CosmeticBenefit } from '#/shared/models/cosmetic';
import {
  convertCosmeticBenefitSelector,
  COSMETIC_BENEFIT_SELECTOR,
} from '#/server/selectors/cosmetic';

// FIXME check recursive tree

class CosmeticBenefitService {
  async create(
    arg: { name: string; parentId?: string },
    trx: PrismaTransaction,
  ): Promise<CosmeticBenefit> {
    return trx.cosmeticBenefit
      .create({
        data: {
          name: arg.name,
          parentId: arg.parentId,
        },
        ...COSMETIC_BENEFIT_SELECTOR,
      })
      .then(convertCosmeticBenefitSelector);
  }

  async update(
    arg: {
      id: string;
      name: string;
      parentId?: string;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticBenefit> {
    return trx.cosmeticBenefit
      .update({
        where: {
          id: arg.id,
        },
        data: {
          name: arg.name,
          parentId: arg.parentId,
        },
        ...COSMETIC_BENEFIT_SELECTOR,
      })
      .then(convertCosmeticBenefitSelector);
  }

  async delete(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ) {
    await trx.cosmeticBenefit.delete({
      where: { id: arg.id },
    });
  }

  async get(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticBenefit> {
    return await trx.cosmeticBenefit
      .findFirstOrThrow({
        where: { id: arg.id },
        ...COSMETIC_BENEFIT_SELECTOR,
      })
      .then(convertCosmeticBenefitSelector);
  }

  async list(_arg: unknown, trx: PrismaTransaction): Promise<CosmeticBenefit[]> {
    return await trx.cosmeticBenefit
      .findMany({
        ...COSMETIC_BENEFIT_SELECTOR,
      })
      .then(items => items.map(convertCosmeticBenefitSelector));
  }
}

export default new CosmeticBenefitService();
