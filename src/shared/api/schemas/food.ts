import {
  CreateFoodMealItemRequest,
  CreateFoodMealItemResponse,
  CreateFoodProductRequest,
  CreateFoodProductResponse,
  CreateFoodRecipeRequest,
  CreateFoodRecipeResponse,
  DeleteFoodMealItemRequest,
  DeleteFoodMealItemResponse,
  DeleteFoodProductRequest,
  DeleteFoodProductResponse,
  DeleteFoodRecipeRequest,
  DeleteFoodRecipeResponse,
  GetFoodProductRequest,
  GetFoodProductResponse,
  GetFoodRecipeRequest,
  GetFoodRecipeResponse,
  ListFoodMealItemsRequest,
  ListFoodMealItemsResponse,
  ListFoodProductsRequest,
  ListFoodProductsResponse,
  ListFoodRecipesRequest,
  ListFoodRecipesResponse,
  UpdateFoodMealItemRequest,
  UpdateFoodMealItemResponse,
  UpdateFoodProductRequest,
  UpdateFoodProductResponse,
  UpdateFoodRecipeRequest,
  UpdateFoodRecipeResponse,
} from '#/shared/api/types/food';
import { createAction } from '#/shared/api/utils';

export const FoodSchema = {
  // Food Products
  createFoodProduct: createAction<CreateFoodProductRequest, CreateFoodProductResponse>({
    path: () => '/api/food/products',
    method: 'POST',
    body: data => data,
  }),
  updateFoodProduct: createAction<UpdateFoodProductRequest, UpdateFoodProductResponse>({
    path: ({ id }) => `/api/food/products/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  getFoodProduct: createAction<GetFoodProductRequest, GetFoodProductResponse>({
    path: ({ id }) => `/api/food/products/${id}`,
    method: 'GET',
  }),
  listFoodProducts: createAction<ListFoodProductsRequest, ListFoodProductsResponse>({
    path: () => `/api/food/products`,
    method: 'GET',
  }),
  deleteFoodProduct: createAction<DeleteFoodProductRequest, DeleteFoodProductResponse>({
    path: ({ id }) => `/api/food/products/${id}`,
    method: 'DELETE',
  }),

  // Food Recipes
  createFoodRecipe: createAction<CreateFoodRecipeRequest, CreateFoodRecipeResponse>({
    path: () => '/api/food/recipes',
    method: 'POST',
    body: data => data,
  }),
  updateFoodRecipe: createAction<UpdateFoodRecipeRequest, UpdateFoodRecipeResponse>({
    path: ({ id }) => `/api/food/recipes/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  getFoodRecipe: createAction<GetFoodRecipeRequest, GetFoodRecipeResponse>({
    path: ({ id }) => `/api/food/recipes/${id}`,
    method: 'GET',
  }),
  listFoodRecipes: createAction<ListFoodRecipesRequest, ListFoodRecipesResponse>({
    path: () => `/api/food/recipes`,
    method: 'GET',
  }),
  deleteFoodRecipe: createAction<DeleteFoodRecipeRequest, DeleteFoodRecipeResponse>({
    path: ({ id }) => `/api/food/recipes/${id}`,
    method: 'DELETE',
  }),

  // Food Meal Items
  listFoodMealItems: createAction<ListFoodMealItemsRequest, ListFoodMealItemsResponse>({
    path: () => `/api/food/meal-items`,
    method: 'GET',
    query: data => data,
  }),
  createFoodMealItem: createAction<CreateFoodMealItemRequest, CreateFoodMealItemResponse>(
    {
      path: () => `/api/food/meal-items`,
      method: 'POST',
      body: data => data,
    },
  ),
  updateFoodMealItem: createAction<UpdateFoodMealItemRequest, UpdateFoodMealItemResponse>(
    {
      path: ({ id }) => `/api/food/meal-items/${id}`,
      method: 'PATCH',
      body: ({ id: _id, ...data }) => data,
    },
  ),
  deleteFoodMealItem: createAction<DeleteFoodMealItemRequest, DeleteFoodMealItemResponse>(
    {
      path: ({ id }) => `/api/food/meal-items/${id}`,
      method: 'DELETE',
    },
  ),
};
