import { PrismaTransaction } from '#/server/prisma';
import { CosmeticRecipe, CosmeticUtils } from '#/shared/models/cosmetic';
import {
  convertCosmeticRecipeSelector,
  COSMETIC_RECIPE_SELECTOR,
} from '#/server/selectors/cosmetic';

interface InsertRecipeData {
  name: string;
  description: string | null;
  phases: Array<{
    name: string;
    ingredients: Array<{
      comment: string | null;
      ingredientId: string;
      percent: number;
    }>;
  }>;
}

function getPhaseCreateData(phase: InsertRecipeData['phases'][number]) {
  return {
    name: phase.name,
    ingredients: {
      create: phase.ingredients.map(ingredient => {
        return {
          percent: ingredient.percent,
          comment: ingredient.comment,
          ingredientId: ingredient.ingredientId,
        };
      }),
    },
  };
}

// FIXME validate data in service instead of controller?
class CosmeticRecipeService {
  async create(arg: InsertRecipeData, trx: PrismaTransaction): Promise<CosmeticRecipe> {
    CosmeticUtils.checkIngredientsPercents(arg);

    return trx.cosmeticRecipe
      .create({
        ...COSMETIC_RECIPE_SELECTOR,
        data: {
          name: arg.name,
          description: arg.description,
          phases: {
            create: arg.phases.map(getPhaseCreateData),
          },
        },
      })
      .then(convertCosmeticRecipeSelector);
  }

  async update(
    arg: InsertRecipeData & { id: string },
    trx: PrismaTransaction,
  ): Promise<CosmeticRecipe> {
    return trx.cosmeticRecipe
      .update({
        ...COSMETIC_RECIPE_SELECTOR,
        where: {
          id: arg.id,
        },
        data: {
          name: arg.name,
          description: arg.description,
          phases: {
            deleteMany: {},
            create: arg.phases.map(getPhaseCreateData),
          },
        },
      })
      .then(convertCosmeticRecipeSelector);
  }

  async delete(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ) {
    await trx.cosmeticRecipe.delete({
      where: { id: arg.id },
    });
  }

  async get(
    arg: {
      id: string;
    },
    trx: PrismaTransaction,
  ): Promise<CosmeticRecipe> {
    return await trx.cosmeticRecipe
      .findFirstOrThrow({
        where: { id: arg.id },
        ...COSMETIC_RECIPE_SELECTOR,
      })
      .then(convertCosmeticRecipeSelector);
  }

  async list(_arg: unknown, trx: PrismaTransaction): Promise<CosmeticRecipe[]> {
    return await trx.cosmeticRecipe
      .findMany({
        ...COSMETIC_RECIPE_SELECTOR,
      })
      .then(items => items.map(convertCosmeticRecipeSelector));
  }
}

export default new CosmeticRecipeService();
