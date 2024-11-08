import { FoodProduct } from '#shared/models/FoodProduct';
import { FoodRecipe, FoodRecipeStatsType } from '#shared/models/FoodRecipe';

interface Id {
  id: string;
}

// Products
export type CreateFoodProductResponse = FoodProduct;
export interface CreateFoodProductRequest {
  name: string;
  manufacturer?: string;
  nutrients: {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
  };
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
  stats: Array<{
    type: FoodRecipeStatsType;
    quantity: number;
  }>;
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
