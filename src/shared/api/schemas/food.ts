import {
  CreateFoodProductRequest,
  CreateFoodProductResponse,
  CreateFoodRecipeRequest,
  CreateFoodRecipeResponse,
  DeleteFoodProductRequest,
  DeleteFoodProductResponse,
  DeleteFoodRecipeRequest,
  DeleteFoodRecipeResponse,
  GetFoodProductRequest,
  GetFoodProductResponse,
  GetFoodRecipeRequest,
  GetFoodRecipeResponse,
  ListFoodProductsRequest,
  ListFoodProductsResponse,
  ListFoodRecipesRequest,
  ListFoodRecipesResponse,
  UpdateFoodProductRequest,
  UpdateFoodProductResponse,
  UpdateFoodRecipeRequest,
  UpdateFoodRecipeResponse,
} from '#/shared/api/types/food';
import { createAction } from '#/shared/api/utils';

export const FoodSchema = {
  products: {
    create: createAction<CreateFoodProductRequest, CreateFoodProductResponse>({
      path: () => '/api/food/products',
      method: 'POST',
      body: data => data,
    }),
    update: createAction<UpdateFoodProductRequest, UpdateFoodProductResponse>({
      path: ({ id }) => `/api/food/products/${id}`,
      method: 'PATCH',
      body: ({ id: _id, ...data }) => data,
    }),
    get: createAction<GetFoodProductRequest, GetFoodProductResponse>({
      path: ({ id }) => `/api/food/products/${id}`,
      method: 'GET',
    }),
    list: createAction<ListFoodProductsRequest, ListFoodProductsResponse>({
      path: () => `/api/food/products`,
      method: 'GET',
    }),
    delete: createAction<DeleteFoodProductRequest, DeleteFoodProductResponse>({
      path: ({ id }) => `/api/food/products/${id}`,
      method: 'DELETE',
    }),
  },
  recipes: {
    create: createAction<CreateFoodRecipeRequest, CreateFoodRecipeResponse>({
      path: () => '/api/food/recipes',
      method: 'POST',
      body: data => data,
    }),
    update: createAction<UpdateFoodRecipeRequest, UpdateFoodRecipeResponse>({
      path: ({ id }) => `/api/food/recipes/${id}`,
      method: 'PATCH',
      body: ({ id: _id, ...data }) => data,
    }),
    get: createAction<GetFoodRecipeRequest, GetFoodRecipeResponse>({
      path: ({ id }) => `/api/food/recipes/${id}`,
      method: 'GET',
    }),
    list: createAction<ListFoodRecipesRequest, ListFoodRecipesResponse>({
      path: () => `/api/food/recipes`,
      method: 'GET',
    }),
    delete: createAction<DeleteFoodRecipeRequest, DeleteFoodRecipeResponse>({
      path: ({ id }) => `/api/food/recipes/${id}`,
      method: 'DELETE',
    }),
  },
};
