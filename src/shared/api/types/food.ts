import {
  FoodMealIngredientType,
  FoodNutrients,
  FoodProduct,
  FoodRecipe,
  FoodRecipeOutput,
  FoodTrackerDay,
} from '#shared/models/food';

interface Id {
  id: string;
}

// Products
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

// Recipes
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

// Tracker
export type CreateFoodMealItemResponse = void;
export interface CreateFoodMealItemRequest {
  ingredient: {
    type: FoodMealIngredientType;
    id: string;
  };
  quantityConverterId: string;
  quantity: number;
  date: string;
}

export type UpdateFoodMealItemResponse = void;
export interface UpdateFoodMealItemRequest extends CreateFoodMealItemRequest {
  itemId: string;
}

export type DeleteFoodMealItemResponse = void;
export interface DeleteFoodMealItemRequest {
  date: string;
  itemId: string;
}

export type GetFoodTrackerDayResponse = FoodTrackerDay;
export interface GetFoodTrackerDayRequest {
  date: string;
}
