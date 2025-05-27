import { DateFormat } from '#/shared/models/date';
import {
  FoodMealItem,
  FoodNutrients,
  FoodProduct,
  FoodRecipe,
  FoodRecipeOutput,
} from '#/shared/models/food';

export * as ProductComplex from './product-complex';

interface Id {
  id: string;
}

// ------ Food Products ------
export type CreateFoodProductResponse = FoodProduct;
export interface CreateFoodProductRequest {
  name: string;
  manufacturer?: string;
  nutrientsPerGram: FoodNutrients;
}

export type UpdateFoodProductResponse = FoodProduct;
export interface UpdateFoodProductRequest extends CreateFoodProductRequest, Id {}

export type DeleteFoodProductResponse = void;
export interface DeleteFoodProductRequest extends Id {}

export type GetFoodProductResponse = FoodProduct;
export interface GetFoodProductRequest extends Id {}

export type ListFoodProductsResponse = FoodProduct[];
export interface ListFoodProductsRequest {}

// ------ Food Recipes ------
export type CreateFoodRecipeResponse = FoodRecipe;
export interface CreateFoodRecipeRequest {
  name: string;
  description: string;
  output: FoodRecipeOutput;
  parts: Array<{
    title: string;
    description?: string;
    ingredients: Array<{
      grams: number;
      productId: string;
      description?: string;
    }>;
  }>;
}

export type UpdateFoodRecipeResponse = FoodRecipe;
export interface UpdateFoodRecipeRequest extends CreateFoodRecipeRequest, Id {}

export type GetFoodRecipeResponse = FoodRecipe;
export interface GetFoodRecipeRequest extends Id {}

export type ListFoodRecipesResponse = FoodRecipe[];
export interface ListFoodRecipesRequest {}

export type DeleteFoodRecipeResponse = void;
export interface DeleteFoodRecipeRequest extends Id {}

// ------ Food Meal Items ------
export type CreateFoodMealItemResponse = FoodMealItem;
export interface CreateFoodMealItemRequest {
  date: DateFormat;
  dayPartId: string;
  quantity: {
    value: number;
    converterId: string;
  };
  food:
    | {
        type: 'product';
        productId: string;
      }
    | {
        type: 'recipe';
        recipeId: string;
      };
}

export type ListFoodMealItemsResponse = FoodMealItem[];
export interface ListFoodMealItemsRequest {
  date: DateFormat;
}

export type UpdateFoodMealItemResponse = FoodMealItem;
export type UpdateFoodMealItemRequest = CreateFoodMealItemRequest & Id;

export type DeleteFoodMealItemResponse = void;
export type DeleteFoodMealItemRequest = Id;

export type GetFoodMealItemResponse = FoodMealItem;
export type GetFoodMealItemRequest = Id;
