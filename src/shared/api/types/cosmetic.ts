import { CosmeticProduct } from '#/shared/models/cosmetic';

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
