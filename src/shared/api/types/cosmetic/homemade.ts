import { CosmeticHomemade_StorageItem } from '#/shared/models/cosmetic';

export type CreateCosmeticHomemade_StorageItemResponse = CosmeticHomemade_StorageItem;
export type CreateCosmeticHomemade_StorageItemRequest = {
  ingredientId: string;
  grams: number;
};

export type UpdateCosmeticHomemade_StorageItemResponse = CosmeticHomemade_StorageItem;
export type UpdateCosmeticHomemade_StorageItemRequest = {
  id: string;
  ingredientId: string;
  grams: number;
};

export type DeleteCosmeticHomemade_StorageItemResponse = void;
export type DeleteCosmeticHomemade_StorageItemRequest = {
  id: string;
  ingredientId: string;
};

export type ListCosmeticHomemade_StorageItemResponse = CosmeticHomemade_StorageItem[];
export type ListCosmeticHomemade_StorageItemRequest = {
  ingredientId: string;
};
