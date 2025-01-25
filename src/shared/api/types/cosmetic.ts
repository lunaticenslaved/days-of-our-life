import {
  CosmeticIngredient,
  CosmeticBenefit,
  CosmeticProduct,
  CosmeticRecipe,
} from '#/shared/models/cosmetic';

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
  benefitIds: string[];
}

export type UpdateCosmeticIngredientResponse = CosmeticIngredient;
export interface UpdateCosmeticIngredientRequest {
  id: string;
  name: string;
  benefitIds: string[];
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

/*===================================================================
  Cosmetic Ingredient Benefits
  =================================================================== */
export type CreateCosmeticBenefitResponse = CosmeticBenefit;
export interface CreateCosmeticBenefitRequest {
  name: string;
  parentId?: string;
}

export type UpdateCosmeticBenefitResponse = CosmeticBenefit;
export interface UpdateCosmeticBenefitRequest {
  id: string;
  name: string;
  parentId?: string;
}

export type DeleteCosmeticBenefitResponse = void;
export interface DeleteCosmeticBenefitRequest {
  id: string;
}

export type GetCosmeticBenefitResponse = CosmeticBenefit;
export interface GetCosmeticBenefitRequest {
  id: string;
}

export type ListCosmeticBenefitsResponse = CosmeticBenefit[];
export interface ListCosmeticBenefitsRequest {}

/*===================================================================
  Cosmetic Recipe
  =================================================================== */
export type CreateCosmeticRecipeResponse = CosmeticRecipe;
export interface CreateCosmeticRecipeRequest {
  name: string;
  description: string | null;
  phases: Array<{
    name: string;
    ingredients: Array<{
      ingredientId: string;
      percent: number;
      comment: string | null;
    }>;
  }>;
}

export type UpdateCosmeticRecipeResponse = CosmeticRecipe;
export interface UpdateCosmeticRecipeRequest extends CreateCosmeticRecipeRequest {
  id: string;
}

export type DeleteCosmeticRecipeResponse = void;
export interface DeleteCosmeticRecipeRequest {
  id: string;
}

export type GetCosmeticRecipeResponse = CosmeticRecipe;
export interface GetCosmeticRecipeRequest {
  id: string;
}

export type ListCosmeticRecipesResponse = CosmeticRecipe[];
export interface ListCosmeticRecipesRequest {}
