import { PrismaTransaction } from '#/server/prisma';
import { CosmeticRecipeComment } from '#/shared/models/cosmetic';
import {
  convertCosmeticRecipeCommentSelector,
  COSMETIC_RECIPE_COMMENT_SELECTOR,
} from '#/server/selectors/cosmetic';

interface InsertCommentData {
  text: string;
  recipeId: string;
}

// FIXME validate data in service instead of controller?
class CosmeticRecipeCommentService {
  async create(
    arg: InsertCommentData,
    trx: PrismaTransaction,
  ): Promise<CosmeticRecipeComment> {
    return trx.cosmeticRecipeComment
      .create({
        ...COSMETIC_RECIPE_COMMENT_SELECTOR,
        data: {
          recipeId: arg.recipeId,
          text: arg.text,
        },
      })
      .then(convertCosmeticRecipeCommentSelector);
  }

  async update(
    arg: InsertCommentData & { id: string },
    trx: PrismaTransaction,
  ): Promise<CosmeticRecipeComment> {
    return trx.cosmeticRecipeComment
      .update({
        ...COSMETIC_RECIPE_COMMENT_SELECTOR,
        where: {
          id: arg.id,
          recipeId: arg.recipeId,
        },
        data: {
          text: arg.text,
        },
      })
      .then(convertCosmeticRecipeCommentSelector);
  }

  async delete(arg: { id: string; recipeId: string }, trx: PrismaTransaction) {
    await trx.cosmeticRecipeComment.delete({
      where: { id: arg.id, recipeId: arg.recipeId },
    });
  }

  async get(arg: { id: string }, trx: PrismaTransaction): Promise<CosmeticRecipeComment> {
    return await trx.cosmeticRecipeComment
      .findFirstOrThrow({
        where: { id: arg.id },
        ...COSMETIC_RECIPE_COMMENT_SELECTOR,
      })
      .then(convertCosmeticRecipeCommentSelector);
  }

  async list(
    arg: { recipeId: string },
    trx: PrismaTransaction,
  ): Promise<CosmeticRecipeComment[]> {
    return await trx.cosmeticRecipeComment
      .findMany({
        where: {
          recipeId: arg.recipeId,
        },
        ...COSMETIC_RECIPE_COMMENT_SELECTOR,
      })
      .then(items => items.map(convertCosmeticRecipeCommentSelector));
  }
}

export default new CosmeticRecipeCommentService();
