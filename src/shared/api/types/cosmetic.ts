import {
  CosmeticIngredient,
  CosmeticBenefit,
  CosmeticProduct,
  CosmeticRecipe,
  CosmeticRecipeComment,
  CosmeticINCIIngredient,
} from '#/shared/models/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { DateFormat } from '#/shared/models/date';

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
  description?: string | null;
  benefitIds: string[];
  INCIIngredientIds: string[];
}

export type UpdateCosmeticIngredientResponse = CosmeticIngredient;
export interface UpdateCosmeticIngredientRequest extends CreateCosmeticIngredientRequest {
  id: string;
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

//  Cosmetic Ingredient Benefits
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

//  Cosmetic Recipe
export type CreateCosmeticRecipeResponse = CosmeticRecipe;
export interface CreateCosmeticRecipeRequest {
  name: string;
  description: string | null;
  phases: Array<{
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

// Cosmetic Recipe Comment
export type CreateCosmeticRecipeCommentResponse = CosmeticRecipeComment;
export type CreateCosmeticRecipeCommentRequest = {
  recipeId: string;
  text: string;
};

export type UpdateCosmeticRecipeCommentResponse = CosmeticRecipeComment;
export type UpdateCosmeticRecipeCommentRequest = CreateCosmeticRecipeCommentRequest & {
  id: string;
};

export type DeleteCosmeticRecipeCommentResponse = void;
export type DeleteCosmeticRecipeCommentRequest = {
  id: string;
  recipeId: string;
};

export type GetCosmeticRecipeCommentResponse = CosmeticRecipeComment;
export type GetCosmeticRecipeCommentRequest = {
  id: string;
  recipeId: string;
};

export type ListCosmeticRecipeCommentsResponse = CosmeticRecipeComment[];
export type ListCosmeticRecipeCommentsRequest = {
  recipeId: string;
};

// Cosmetic INCI Ingredient
export type CreateCosmeticINCIIngredientResponse = CosmeticINCIIngredient;
export type CreateCosmeticINCIIngredientRequest = {
  name: string;
  benefitIds: string[];
};

export type UpdateCosmeticINCIIngredientResponse = CosmeticINCIIngredient;
export type UpdateCosmeticINCIIngredientRequest = CreateCosmeticINCIIngredientRequest & {
  id: string;
};

export type DeleteCosmeticINCIIngredientResponse = void;
export type DeleteCosmeticINCIIngredientRequest = {
  id: string;
};

export type GetCosmeticINCIIngredientResponse = CosmeticINCIIngredient;
export type GetCosmeticINCIIngredientRequest = {
  id: string;
};

export type ListCosmeticINCIIngredientsResponse = CosmeticINCIIngredient[];
export type ListCosmeticINCIIngredientsRequest = unknown;

// --- Cosmetic Applications ------------------------------------
export type CreateCosmeticApplicationResponse = CosmeticApplication;
export type CreateCosmeticApplicationRequest = {
  date: DateFormat;
  dayPartId: string;
  source:
    | {
        type: 'product';
        productId: string;
      }
    | {
        type: 'recipe';
        recipeId: string;
      };
};

export type UpdateCosmeticApplicationResponse = CosmeticApplication;
export type UpdateCosmeticApplicationRequest = {
  id: string;
} & CreateCosmeticApplicationRequest;

export type ListCosmeticApplicationsResponse = CosmeticApplication[];
export interface ListCosmeticApplicationsRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}

export type GetCosmeticApplicationResponse = CosmeticApplication;
export type GetCosmeticApplicationRequest = { id: string };

export type DeleteCosmeticApplicationResponse = void;
export type DeleteCosmeticApplicationRequest = { id: string };
