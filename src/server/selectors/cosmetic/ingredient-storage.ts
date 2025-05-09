import { Prisma } from '@prisma/client';
import { CosmeticHomemade_StorageItem } from '#/shared/models/cosmetic';
import _ from 'lodash';

export const COSMETIC_HOMEMADE__INGREDIENT_STORAGE_ITEM_SELECTOR = {
  select: {
    id: true,
    ingredientId: true,
    grams: true,
  },
} satisfies Prisma.CosmeticHomemade_IngredientStorageItemDefaultArgs;

export function convertCosmeticHomemadeIngredientStorageItemSelector(
  data: Prisma.CosmeticHomemade_IngredientStorageItemGetPayload<
    typeof COSMETIC_HOMEMADE__INGREDIENT_STORAGE_ITEM_SELECTOR
  >,
): CosmeticHomemade_StorageItem {
  return data;
}
