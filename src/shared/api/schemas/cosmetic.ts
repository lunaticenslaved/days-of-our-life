import {
  CreateCosmeticProductRequest,
  CreateCosmeticProductResponse,
  DeleteCosmeticProductRequest,
  DeleteCosmeticProductResponse,
  ListCosmeticProductsRequest,
  ListCosmeticProductsResponse,
  UpdateCosmeticProductRequest,
  UpdateCosmeticProductResponse,
  GetCosmeticProductRequest,
  GetCosmeticProductResponse,
} from '#/shared/api/types/cosmetic';
import { createAction } from '#/shared/api/utils';

export const CosmeticSchema = {
  createCosmeticProduct: createAction<
    CreateCosmeticProductRequest,
    CreateCosmeticProductResponse
  >({
    path: () => `/api/cosmetic/products`,
    method: 'POST',
    body: data => data,
  }),
  updateCosmeticProduct: createAction<
    UpdateCosmeticProductRequest,
    UpdateCosmeticProductResponse
  >({
    path: ({ id }) => `/api/cosmetic/products/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  deleteCosmeticProduct: createAction<
    DeleteCosmeticProductRequest,
    DeleteCosmeticProductResponse
  >({
    path: ({ id }) => `/api/cosmetic/products/${id}`,
    method: 'DELETE',
  }),
  listCosmeticProducts: createAction<
    ListCosmeticProductsRequest,
    ListCosmeticProductsResponse
  >({
    path: () => `/api/cosmetic/products`,
    method: 'GET',
  }),
  getCosmeticProduct: createAction<GetCosmeticProductRequest, GetCosmeticProductResponse>(
    {
      path: ({ id }) => `/api/cosmetic/products/${id}`,
      method: 'GET',
    },
  ),
};
