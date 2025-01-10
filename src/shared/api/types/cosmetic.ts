import { CosmeticIngredient, CosmeticProduct } from '#/shared/models/cosmetic';

export type CreateCosmeticProductResponse = CosmeticProduct;
export interface CreateCosmeticProductRequest {
  name: string;
  manufacturer: string;
}

export type UpdateCosmeticProductResponse = CosmeticProduct;
export interface UpdateCosmeticProductRequest {
  id: string;
  name: string;
  manufacturer: string;
}

export type DeleteCosmeticProductResponse = void;
export interface DeleteCosmeticProductRequest {
  id: string;
}

export type GetCosmeticProductResponse = CosmeticProduct;
export interface GetCosmeticProductRequest {
  id: string;
}

export type ListCosmeticProductsResponse = CosmeticProduct[];
export interface ListCosmeticProductsRequest {}

// Cosmetic Ingredients
export type CreateCosmeticIngredientResponse = CosmeticIngredient;
export interface CreateCosmeticIngredientRequest {
  name: string;
}

export type UpdateCosmeticIngredientResponse = CosmeticIngredient;
export interface UpdateCosmeticIngredientRequest {
  id: string;
  name: string;
}

export type DeleteCosmeticIngredientResponse = void;
export interface DeleteCosmeticIngredientRequest {
  id: string;
}

export type GetCosmeticIngredientResponse = CosmeticIngredient;
export interface GetCosmeticIngredientRequest {
  id: string;
}

export type ListCosmeticIngredientsResponse = CosmeticIngredient[];
export interface ListCosmeticIngredientsRequest {}
