import {
  CreateFoodMealItemRequest,
  CreateFoodMealItemResponse,
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
  GetFoodTrackerDayRequest,
  GetFoodTrackerDayResponse,
  UpdateFoodProductRequest,
  UpdateFoodProductResponse,
  UpdateFoodRecipeRequest,
  UpdateFoodRecipeResponse,
  UpdateFoodMealItemRequest,
  UpdateFoodMealItemResponse,
  DeleteFoodMealItemRequest,
  DeleteFoodMealItemResponse,
} from '#shared/api/types/food';
import { createAction } from '#shared/api/utils';

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
      method: 'POST',
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
  tracker: {
    days: {
      get: createAction<GetFoodTrackerDayRequest, GetFoodTrackerDayResponse>({
        path: ({ date }) => `/api/food/tracker/days/${date}`,
        method: 'GET',
      }),
      meals: {
        items: {
          create: createAction<CreateFoodMealItemRequest, CreateFoodMealItemResponse>({
            path: ({ date }) => `/api/food/tracker/days/${date}/meals/items`,
            method: 'POST',
            body: data => data,
          }),
          update: createAction<UpdateFoodMealItemRequest, UpdateFoodMealItemResponse>({
            path: ({ itemId, date }) =>
              `/api/food/tracker/days/${date}/meals/items/${itemId}`,
            method: 'PATCH',
            body: ({ itemId: _id, ...data }) => data,
          }),
          delete: createAction<DeleteFoodMealItemRequest, DeleteFoodMealItemResponse>({
            path: ({ itemId, date }) =>
              `/api/food/tracker/days/${date}/meals/items/${itemId}`,
            method: 'DELETE',
            body: ({ itemId: _id }) => ({}),
          }),
        },
      },
    },
  },
};
