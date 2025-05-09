import {
  convertCosmeticHomemadeIngredientStorageItemSelector,
  COSMETIC_HOMEMADE__INGREDIENT_STORAGE_ITEM_SELECTOR,
} from '#/server/selectors/cosmetic';
import { Controller } from '#/server/utils/Controller';
import {
  CreateCosmeticHomemade_StorageItemRequest,
  CreateCosmeticHomemade_StorageItemResponse,
} from '#/shared/api/types/cosmetic/homemade';
import { CommonValidators } from '#/shared/models/common';
import { z } from 'zod';

export default new Controller<'cosmetic/homemade/ingredients'>({
  'POST /cosmetic/homemade/ingredients/:ingredientId/storage': Controller.handler<
    CreateCosmeticHomemade_StorageItemRequest,
    CreateCosmeticHomemade_StorageItemResponse
  >({
    validator: z.object({
      ingredientId: CommonValidators.id,
      grams: CommonValidators.number({ min: 0 }),
    }),
    parse: req => ({
      ingredientId: req.params.ingredientId,
      grams: req.body.grams,
    }),
    handler: async ({ ingredientId, grams }, { prisma }) => {
      return await prisma.$transaction(async trx => {
        const item = await trx.cosmeticHomemade_IngredientStorageItem.findFirst({
          where: {
            ingredientId,
          },
        });

        if (item) {
          return await trx.cosmeticHomemade_IngredientStorageItem
            .update({
              where: {
                id: item.id,
              },
              data: {
                ingredientId,
                grams,
              },
              ...COSMETIC_HOMEMADE__INGREDIENT_STORAGE_ITEM_SELECTOR,
            })
            .then(convertCosmeticHomemadeIngredientStorageItemSelector);
        } else {
          return await trx.cosmeticHomemade_IngredientStorageItem
            .create({
              data: {
                ingredientId,
                grams,
              },
              ...COSMETIC_HOMEMADE__INGREDIENT_STORAGE_ITEM_SELECTOR,
            })
            .then(convertCosmeticHomemadeIngredientStorageItemSelector);
        }
      });
    },
  }),
});
