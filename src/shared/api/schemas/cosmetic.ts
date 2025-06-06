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
  CreateCosmeticIngredientRequest,
  CreateCosmeticIngredientResponse,
  UpdateCosmeticIngredientRequest,
  UpdateCosmeticIngredientResponse,
  DeleteCosmeticIngredientRequest,
  DeleteCosmeticIngredientResponse,
  GetCosmeticIngredientRequest,
  GetCosmeticIngredientResponse,
  ListCosmeticIngredientsRequest,
  ListCosmeticIngredientsResponse,
  CreateCosmeticBenefitRequest,
  CreateCosmeticBenefitResponse,
  UpdateCosmeticBenefitRequest,
  UpdateCosmeticBenefitResponse,
  DeleteCosmeticBenefitRequest,
  DeleteCosmeticBenefitResponse,
  GetCosmeticBenefitRequest,
  GetCosmeticBenefitResponse,
  ListCosmeticBenefitsRequest,
  ListCosmeticBenefitsResponse,
  CreateCosmeticRecipeRequest,
  CreateCosmeticRecipeResponse,
  UpdateCosmeticRecipeRequest,
  UpdateCosmeticRecipeResponse,
  DeleteCosmeticRecipeRequest,
  DeleteCosmeticRecipeResponse,
  GetCosmeticRecipeRequest,
  GetCosmeticRecipeResponse,
  ListCosmeticRecipesRequest,
  ListCosmeticRecipesResponse,
  CreateCosmeticRecipeCommentRequest,
  CreateCosmeticRecipeCommentResponse,
  UpdateCosmeticRecipeCommentRequest,
  UpdateCosmeticRecipeCommentResponse,
  DeleteCosmeticRecipeCommentRequest,
  DeleteCosmeticRecipeCommentResponse,
  GetCosmeticRecipeCommentRequest,
  GetCosmeticRecipeCommentResponse,
  ListCosmeticRecipeCommentsRequest,
  ListCosmeticRecipeCommentsResponse,
  CreateCosmeticINCIIngredientRequest,
  CreateCosmeticINCIIngredientResponse,
  UpdateCosmeticINCIIngredientRequest,
  UpdateCosmeticINCIIngredientResponse,
  DeleteCosmeticINCIIngredientRequest,
  DeleteCosmeticINCIIngredientResponse,
  GetCosmeticINCIIngredientRequest,
  GetCosmeticINCIIngredientResponse,
  ListCosmeticINCIIngredientsRequest,
  ListCosmeticINCIIngredientsResponse,
  CreateCosmeticApplicationRequest,
  CreateCosmeticApplicationResponse,
  UpdateCosmeticApplicationRequest,
  UpdateCosmeticApplicationResponse,
  DeleteCosmeticApplicationRequest,
  DeleteCosmeticApplicationResponse,
  GetCosmeticApplicationRequest,
  GetCosmeticApplicationResponse,
  ListCosmeticApplicationsRequest,
  ListCosmeticApplicationsResponse,
} from '#/shared/api/types/cosmetic';
import {
  CreateCosmeticHomemade_StorageItemRequest,
  CreateCosmeticHomemade_StorageItemResponse,
} from '#/shared/api/types/cosmetic/homemade';
import { createAction } from '#/shared/api/utils';

export const CosmeticSchema = {
  // Cosmetic Products
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

  // Cosmetic Ingredients
  createCosmeticIngredient: createAction<
    CreateCosmeticIngredientRequest,
    CreateCosmeticIngredientResponse
  >({
    path: () => `/api/cosmetic/ingredients`,
    method: 'POST',
    body: data => data,
  }),
  updateCosmeticIngredient: createAction<
    UpdateCosmeticIngredientRequest,
    UpdateCosmeticIngredientResponse
  >({
    path: ({ id }) => `/api/cosmetic/ingredients/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  deleteCosmeticIngredient: createAction<
    DeleteCosmeticIngredientRequest,
    DeleteCosmeticIngredientResponse
  >({
    path: ({ id }) => `/api/cosmetic/ingredients/${id}`,
    method: 'DELETE',
  }),
  getCosmeticIngredient: createAction<
    GetCosmeticIngredientRequest,
    GetCosmeticIngredientResponse
  >({
    path: ({ id }) => `/api/cosmetic/ingredients/${id}`,
    method: 'GET',
  }),
  listCosmeticIngredients: createAction<
    ListCosmeticIngredientsRequest,
    ListCosmeticIngredientsResponse
  >({
    path: () => `/api/cosmetic/ingredients`,
    method: 'GET',
  }),

  // Cosmetic Benefits
  createCosmeticBenefit: createAction<
    CreateCosmeticBenefitRequest,
    CreateCosmeticBenefitResponse
  >({
    path: () => `/api/cosmetic/benefits`,
    method: 'POST',
    body: data => data,
  }),
  updateCosmeticBenefit: createAction<
    UpdateCosmeticBenefitRequest,
    UpdateCosmeticBenefitResponse
  >({
    path: ({ id }) => `/api/cosmetic/benefits/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  deleteCosmeticBenefit: createAction<
    DeleteCosmeticBenefitRequest,
    DeleteCosmeticBenefitResponse
  >({
    path: ({ id }) => `/api/cosmetic/benefits/${id}`,
    method: 'DELETE',
  }),
  getCosmeticBenefit: createAction<GetCosmeticBenefitRequest, GetCosmeticBenefitResponse>(
    {
      path: ({ id }) => `/api/cosmetic/benefits/${id}`,
      method: 'GET',
    },
  ),
  listCosmeticBenefits: createAction<
    ListCosmeticBenefitsRequest,
    ListCosmeticBenefitsResponse
  >({
    path: () => `/api/cosmetic/benefits`,
    method: 'GET',
  }),

  /* =============== Cosmetic Recipe === Start =============== */
  createCosmeticRecipe: createAction<
    CreateCosmeticRecipeRequest,
    CreateCosmeticRecipeResponse
  >({
    path: () => `/api/cosmetic/recipes`,
    method: 'POST',
    body: data => data,
  }),
  updateCosmeticRecipe: createAction<
    UpdateCosmeticRecipeRequest,
    UpdateCosmeticRecipeResponse
  >({
    path: ({ id }) => `/api/cosmetic/recipes/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  deleteCosmeticRecipe: createAction<
    DeleteCosmeticRecipeRequest,
    DeleteCosmeticRecipeResponse
  >({
    path: ({ id }) => `/api/cosmetic/recipes/${id}`,
    method: 'DELETE',
  }),
  getCosmeticRecipe: createAction<GetCosmeticRecipeRequest, GetCosmeticRecipeResponse>({
    path: ({ id }) => `/api/cosmetic/recipes/${id}`,
    method: 'GET',
  }),
  listCosmeticRecipes: createAction<
    ListCosmeticRecipesRequest,
    ListCosmeticRecipesResponse
  >({
    path: () => `/api/cosmetic/recipes`,
    method: 'GET',
  }),
  /* =============== Cosmetic Recipe === End =============== */

  /* =============== Cosmetic Recipe Comment === Start =============== */
  createCosmeticRecipeComment: createAction<
    CreateCosmeticRecipeCommentRequest,
    CreateCosmeticRecipeCommentResponse
  >({
    path: ({ recipeId }) => `/api/cosmetic/recipes/${recipeId}/comments`,
    method: 'POST',
    body: ({ recipeId: _recipeId, ...data }) => data,
  }),
  updateCosmeticRecipeComment: createAction<
    UpdateCosmeticRecipeCommentRequest,
    UpdateCosmeticRecipeCommentResponse
  >({
    path: ({ recipeId, id }) => `/api/cosmetic/recipes/${recipeId}/comments/${id}`,
    method: 'PATCH',
    body: ({ id: _id, recipeId: _recipeId, ...data }) => data,
  }),
  deleteCosmeticRecipeComment: createAction<
    DeleteCosmeticRecipeCommentRequest,
    DeleteCosmeticRecipeCommentResponse
  >({
    path: ({ recipeId, id }) => `/api/cosmetic/recipes/${recipeId}/comments/${id}`,
    method: 'DELETE',
  }),
  getCosmeticRecipeComment: createAction<
    GetCosmeticRecipeCommentRequest,
    GetCosmeticRecipeCommentResponse
  >({
    path: ({ recipeId, id }) => `/api/cosmetic/recipes/${recipeId}/comments/${id}`,
    method: 'GET',
  }),
  listCosmeticRecipeComments: createAction<
    ListCosmeticRecipeCommentsRequest,
    ListCosmeticRecipeCommentsResponse
  >({
    path: ({ recipeId }) => `/api/cosmetic/recipes/${recipeId}/comments`,
    method: 'GET',
  }),

  // Cosmetic ICNI Ingredients
  createCosmeticINCIIngredient: createAction<
    CreateCosmeticINCIIngredientRequest,
    CreateCosmeticINCIIngredientResponse
  >({
    path: () => `/api/cosmetic/inci-ingredients`,
    method: 'POST',
    body: data => data,
  }),
  updateCosmeticINCIIngredient: createAction<
    UpdateCosmeticINCIIngredientRequest,
    UpdateCosmeticINCIIngredientResponse
  >({
    path: ({ id }) => `/api/cosmetic/inci-ingredients/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  deleteCosmeticINCIIngredient: createAction<
    DeleteCosmeticINCIIngredientRequest,
    DeleteCosmeticINCIIngredientResponse
  >({
    path: ({ id }) => `/api/cosmetic/inci-ingredients/${id}`,
    method: 'DELETE',
  }),
  getCosmeticINCIIngredient: createAction<
    GetCosmeticINCIIngredientRequest,
    GetCosmeticINCIIngredientResponse
  >({
    path: ({ id }) => `/api/cosmetic/inci-ingredients/${id}`,
    method: 'GET',
  }),
  listCosmeticINCIIngredients: createAction<
    ListCosmeticINCIIngredientsRequest,
    ListCosmeticINCIIngredientsResponse
  >({
    path: () => `/api/cosmetic/inci-ingredients`,
    method: 'GET',
  }),

  // --- Cosmetic Applications ------------------------------
  createCosmeticApplication: createAction<
    CreateCosmeticApplicationRequest,
    CreateCosmeticApplicationResponse
  >({
    path: () => `/api/cosmetic/applications`,
    method: 'POST',
    body: data => data,
  }),
  updateCosmeticApplication: createAction<
    UpdateCosmeticApplicationRequest,
    UpdateCosmeticApplicationResponse
  >({
    path: ({ id }) => `/api/cosmetic/applications/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  deleteCosmeticApplication: createAction<
    DeleteCosmeticApplicationRequest,
    DeleteCosmeticApplicationResponse
  >({
    path: ({ id }) => `/api/cosmetic/applications/${id}`,
    method: 'DELETE',
  }),
  getCosmeticApplication: createAction<
    GetCosmeticApplicationRequest,
    GetCosmeticApplicationResponse
  >({
    path: ({ id }) => `/api/cosmetic/applications/${id}`,
    method: 'GET',
  }),
  listCosmeticApplications: createAction<
    ListCosmeticApplicationsRequest,
    ListCosmeticApplicationsResponse
  >({
    path: () => `/api/cosmetic/applications`,
    method: 'GET',
    query: data => data,
  }),

  // --- Cosmetic Homemade Ingredient Store ---------------------------------
  updateHomemadeCosmeticIngredientStorage: createAction<
    CreateCosmeticHomemade_StorageItemRequest,
    CreateCosmeticHomemade_StorageItemResponse
  >({
    path: ({ ingredientId }) =>
      `/api/cosmetic/homemade/ingredients/${ingredientId}/storage`,
    method: 'POST',
    body: ({ ingredientId: _ingredientId, ...data }) => data,
  }),
};
