import { Schema } from '#/shared/api/schemas';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import {
  DefaultError,
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  CreateCosmeticBenefitRequest,
  CreateCosmeticBenefitResponse,
  CreateCosmeticINCIIngredientRequest,
  CreateCosmeticINCIIngredientResponse,
  CreateCosmeticIngredientRequest,
  CreateCosmeticIngredientResponse,
  CreateCosmeticRecipeCommentRequest,
  CreateCosmeticRecipeCommentResponse,
  CreateCosmeticRecipeRequest,
  CreateCosmeticRecipeResponse,
  DeleteCosmeticBenefitRequest,
  DeleteCosmeticBenefitResponse,
  DeleteCosmeticINCIIngredientRequest,
  DeleteCosmeticINCIIngredientResponse,
  DeleteCosmeticIngredientRequest,
  DeleteCosmeticIngredientResponse,
  DeleteCosmeticRecipeCommentRequest,
  DeleteCosmeticRecipeCommentResponse,
  DeleteCosmeticRecipeRequest,
  DeleteCosmeticRecipeResponse,
  GetCosmeticBenefitResponse,
  GetCosmeticINCIIngredientResponse,
  GetCosmeticIngredientResponse,
  GetCosmeticRecipeCommentResponse,
  GetCosmeticRecipeResponse,
  ListCosmeticBenefitsResponse,
  ListCosmeticINCIIngredientsResponse,
  ListCosmeticIngredientsResponse,
  ListCosmeticRecipeCommentsResponse,
  ListCosmeticRecipesRequest,
  ListCosmeticRecipesResponse,
  UpdateCosmeticBenefitRequest,
  UpdateCosmeticBenefitResponse,
  UpdateCosmeticINCIIngredientRequest,
  UpdateCosmeticINCIIngredientResponse,
  UpdateCosmeticIngredientRequest,
  UpdateCosmeticIngredientResponse,
  UpdateCosmeticRecipeCommentRequest,
  UpdateCosmeticRecipeCommentResponse,
  UpdateCosmeticRecipeRequest,
  UpdateCosmeticRecipeResponse,
} from '#/shared/api/types/cosmetic';
import {
  CosmeticIngredient,
  CosmeticBenefit,
  CosmeticRecipe,
  CosmeticRecipeComment,
  CosmeticINCIIngredient,
} from '#/shared/models/cosmetic';
import { cloneDeep, orderBy } from 'lodash';
import dayjs from '#/shared/libs/dayjs';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

const StoreKeys = {
  // Cosmetic Ingredients
  getCosmeticIngredient: (ingredientId: string): QueryKey => [
    'cosmetic',
    'ingredients',
    ingredientId,
  ],
  listCosmeticIngredients: (): QueryKey => ['cosmetic', 'ingredients'],
  createCosmeticIngredient: (): MutationKey => ['cosmetic', 'ingredients', 'create'],
  deleteCosmeticIngredient: (): MutationKey => ['cosmetic', 'ingredients', 'delete'],
  updateCosmeticIngredient: (): MutationKey => ['cosmetic', 'ingredients', 'update'],

  // Cosmetic Benefits
  getCosmeticBenefit: (benefitId: string): QueryKey => [
    'cosmetic',
    'benefits',
    benefitId,
  ],
  listCosmeticBenefits: (): QueryKey => ['cosmetic', 'benefits'],
  createCosmeticBenefit: (): MutationKey => ['cosmetic', 'benefits', 'create'],
  deleteCosmeticBenefit: (): MutationKey => ['cosmetic', 'benefits', 'delete'],
  updateCosmeticBenefit: (): MutationKey => ['cosmetic', 'benefits', 'update'],

  // Cosmetic Recipes
  getCosmeticRecipe: (recipeId: string): QueryKey => ['cosmetic', 'recipes', recipeId],
  listCosmeticRecipes: (): QueryKey => ['cosmetic', 'recipes'],
  createCosmeticRecipe: (): MutationKey => ['cosmetic', 'recipes', 'create'],
  deleteCosmeticRecipe: (): MutationKey => ['cosmetic', 'recipes', 'delete'],
  updateCosmeticRecipe: (): MutationKey => ['cosmetic', 'recipes', 'update'],

  // Cosmetic Recipe Comments
  getCosmeticRecipeComment: ({
    recipeId,
    commentId,
  }: {
    commentId: string;
    recipeId: string;
  }): QueryKey => ['cosmetic', 'recipes', recipeId, 'comments', commentId],
  listCosmeticRecipeComments: ({ recipeId }: { recipeId: string }): QueryKey => [
    'cosmetic',
    'recipes',
    recipeId,
    'comments',
  ],
  createCosmeticRecipeComment: (): MutationKey => ['cosmetic', 'recipes', 'create'],
  deleteCosmeticRecipeComment: (): MutationKey => ['cosmetic', 'recipes', 'delete'],
  updateCosmeticRecipeComment: (): MutationKey => ['cosmetic', 'recipes', 'update'],

  // Cosmetic INCI Ingredients
  getCosmeticINCIIngredient: (ingredientId: string): QueryKey => [
    'cosmetic',
    'inci-ingredients',
    ingredientId,
  ],
  listCosmeticINCIIngredients: (): QueryKey => ['cosmetic', 'inci-ingredients'],
  createCosmeticINCIIngredient: (): MutationKey => [
    'cosmetic',
    'inci-ingredients',
    'create',
  ],
  deleteCosmeticINCIIngredient: (): MutationKey => [
    'cosmetic',
    'inci-ingredients',
    'delete',
  ],
  updateCosmeticINCIIngredient: (): MutationKey => [
    'cosmetic',
    'inci-ingredients',
    'update',
  ],
};

// Cosmetic Ingredients
export function useCreateCosmeticIngredientMutation(
  handlers: MutationHandlers<CosmeticIngredient> = {},
) {
  return useMutation<
    CreateCosmeticIngredientResponse,
    DefaultError,
    CreateCosmeticIngredientRequest,
    {
      createdItem: CosmeticIngredient;
    }
  >({
    mutationKey: StoreKeys.createCosmeticIngredient(),
    mutationFn: wrapApiAction<
      CreateCosmeticIngredientRequest,
      CreateCosmeticIngredientResponse
    >(Schema.cosmetic.createCosmeticIngredient),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticIngredients(),
      });

      const createdItem: CosmeticIngredient = {
        id: Date.now().toString(),
        name: request.name,
        description: request.description || null,
        INCIIngredientIds: request.INCIIngredientIds,
        benefitIds: request.benefitIds,
      };

      updateCosmeticIngredientsQueries({
        addCosmeticIngredient: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticIngredientsQueries({
          removeCosmeticIngredientById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticIngredientsQueries({
        removeCosmeticIngredientById: context?.createdItem.id,
        addCosmeticIngredient: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticIngredientMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteCosmeticIngredientResponse,
    DefaultError,
    CosmeticIngredient,
    {
      deletedItem?: CosmeticIngredient;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticIngredient(),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticIngredientRequest, DeleteCosmeticIngredientResponse>(
        Schema.cosmetic.deleteCosmeticIngredient,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticIngredients() });

      const deletedItem = request;

      updateCosmeticIngredientsQueries({
        removeCosmeticIngredientById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticIngredientsQueries({
          addCosmeticIngredient: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticIngredientMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateCosmeticIngredientResponse,
    DefaultError,
    {
      ingredient: CosmeticIngredient;
      newData: Omit<UpdateCosmeticIngredientRequest, 'id'>;
    },
    {
      oldItem: CosmeticIngredient;
      newItem: CosmeticIngredient;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticIngredient(),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticIngredientRequest, UpdateCosmeticIngredientResponse>(
        Schema.cosmetic.updateCosmeticIngredient,
      )({ ...data.newData, id: data.ingredient.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticIngredients() });

      const newItem: CosmeticIngredient = {
        id: request.ingredient.id,
        name: request.newData.name,
        description: request.newData.description || null,
        INCIIngredientIds: request.newData.INCIIngredientIds,
        benefitIds: request.newData.benefitIds,
      };

      updateCosmeticIngredientsQueries({
        removeCosmeticIngredientById: request.ingredient.id,
        addCosmeticIngredient: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.ingredient,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticIngredientsQueries({
          removeCosmeticIngredientById: context.newItem.id,
          addCosmeticIngredient: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticIngredientQuery(ingredientId: string) {
  return useQuery<GetCosmeticIngredientResponse, Error, GetCosmeticIngredientResponse>({
    queryKey: StoreKeys.getCosmeticIngredient(ingredientId),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.getCosmeticIngredient)({ id: ingredientId }),
  });
}

export function useListCosmeticIngredientsQuery() {
  return useQuery<
    ListCosmeticIngredientsResponse,
    Error,
    ListCosmeticIngredientsResponse
  >({
    queryKey: StoreKeys.listCosmeticIngredients(),
    queryFn: wrapApiAction(Schema.cosmetic.listCosmeticIngredients),
    select: data => {
      return orderBy(data, item => item.name.toLocaleLowerCase(), 'asc');
    },
  });
}

function updateCosmeticIngredientsQueries(arg: {
  addCosmeticIngredient?: CosmeticIngredient;
  removeCosmeticIngredientById?: string;
}) {
  if (arg.removeCosmeticIngredientById) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticIngredient(arg.removeCosmeticIngredientById),
    });
  }

  if (arg.addCosmeticIngredient) {
    queryClient.setQueryData(
      StoreKeys.getCosmeticIngredient(arg.addCosmeticIngredient.id),
      arg.addCosmeticIngredient,
    );
  }

  queryClient.setQueryData<ListCosmeticIngredientsResponse>(
    StoreKeys.listCosmeticIngredients(),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticIngredientById) {
        old = old.filter(item => item.id !== arg.removeCosmeticIngredientById);
      }

      if (arg.addCosmeticIngredient) {
        old.push(arg.addCosmeticIngredient);
      }

      return old;
    },
  );
}

// Cosmetic Benefits
export function useCreateCosmeticBenefitMutation(
  handlers: MutationHandlers<CosmeticBenefit> = {},
) {
  return useMutation<
    CreateCosmeticBenefitResponse,
    DefaultError,
    CreateCosmeticBenefitRequest,
    {
      createdItem: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.createCosmeticBenefit(),
    mutationFn: wrapApiAction<
      CreateCosmeticBenefitRequest,
      CreateCosmeticBenefitResponse
    >(Schema.cosmetic.createCosmeticBenefit),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticBenefits(),
      });

      const createdItem: CosmeticBenefit = {
        id: Date.now().toString(),
        name: request.name,
        parentId: request.parentId,
      };

      updateCosmeticBenefitsQueries({
        addCosmeticBenefit: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries({
          removeCosmeticBenefitById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticBenefitsQueries({
        removeCosmeticBenefitById: context?.createdItem.id,
        addCosmeticBenefit: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticBenefitMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteCosmeticBenefitResponse,
    DefaultError,
    CosmeticBenefit,
    {
      deletedItem?: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticBenefit(),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticBenefitRequest, DeleteCosmeticBenefitResponse>(
        Schema.cosmetic.deleteCosmeticBenefit,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticBenefits() });

      const deletedItem = request;

      updateCosmeticBenefitsQueries({
        removeCosmeticBenefitById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries({
          addCosmeticBenefit: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticBenefitMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateCosmeticBenefitResponse,
    DefaultError,
    {
      oldItem: CosmeticBenefit;
      newData: Omit<UpdateCosmeticBenefitRequest, 'id'>;
    },
    {
      oldItem: CosmeticBenefit;
      newItem: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticBenefit(),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticBenefitRequest, UpdateCosmeticBenefitResponse>(
        Schema.cosmetic.updateCosmeticBenefit,
      )({ id: data.oldItem.id, ...data.newData }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticBenefits() });

      const newItem: CosmeticBenefit = {
        id: request.oldItem.id,
        ...request.newData,
      };

      updateCosmeticBenefitsQueries({
        removeCosmeticBenefitById: request.oldItem.id,
        addCosmeticBenefit: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries({
          removeCosmeticBenefitById: context.newItem.id,
          addCosmeticBenefit: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticBenefitQuery(benefitId: string) {
  return useQuery<GetCosmeticBenefitResponse, Error, GetCosmeticBenefitResponse>({
    queryKey: StoreKeys.getCosmeticBenefit(benefitId),
    queryFn: () => wrapApiAction(Schema.cosmetic.getCosmeticBenefit)({ id: benefitId }),
  });
}

export function useListCosmeticBenefitsQuery(enabled = true) {
  return useQuery<ListCosmeticBenefitsResponse, Error, ListCosmeticBenefitsResponse>({
    queryKey: StoreKeys.listCosmeticBenefits(),
    queryFn: wrapApiAction(Schema.cosmetic.listCosmeticBenefits),
    select: data => {
      return orderBy(data, item => item.name, 'asc');
    },
    enabled,
  });
}

function updateCosmeticBenefitsQueries(arg: {
  addCosmeticBenefit?: CosmeticBenefit;
  removeCosmeticBenefitById?: string;
}) {
  if (arg.removeCosmeticBenefitById) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticBenefit(arg.removeCosmeticBenefitById),
    });
  }

  if (arg.addCosmeticBenefit) {
    queryClient.setQueryData(
      StoreKeys.getCosmeticBenefit(arg.addCosmeticBenefit.id),
      arg.addCosmeticBenefit,
    );
  }

  queryClient.setQueryData<ListCosmeticBenefitsResponse>(
    StoreKeys.listCosmeticBenefits(),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticBenefitById) {
        old = old.filter(item => item.id !== arg.removeCosmeticBenefitById);
      }

      if (arg.addCosmeticBenefit) {
        old.push(arg.addCosmeticBenefit);
      }

      return old;
    },
  );
}

// Cosmetic Recipes
export function useCreateCosmeticRecipeMutation(
  handlers: MutationHandlers<CosmeticRecipe> = {},
) {
  return useMutation<
    CreateCosmeticRecipeResponse,
    DefaultError,
    CreateCosmeticRecipeRequest,
    {
      createdItem: CosmeticRecipe;
    }
  >({
    mutationKey: StoreKeys.createCosmeticRecipe(),
    mutationFn: wrapApiAction<CreateCosmeticRecipeRequest, CreateCosmeticRecipeResponse>(
      Schema.cosmetic.createCosmeticRecipe,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipes(),
      });

      const createdItem: CosmeticRecipe = {
        id: Date.now().toString(),
        name: request.name,
        description: request.description,
        phases: cloneDeep(request.phases),
      };

      updateCosmeticRecipesQueries({
        addCosmeticRecipe: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipesQueries({
          removeCosmeticRecipeById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticRecipesQueries({
        removeCosmeticRecipeById: context?.createdItem.id,
        addCosmeticRecipe: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticRecipeMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteCosmeticRecipeResponse,
    DefaultError,
    CosmeticRecipe,
    {
      deletedItem?: CosmeticRecipe;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticRecipe(),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticRecipeRequest, DeleteCosmeticRecipeResponse>(
        Schema.cosmetic.deleteCosmeticRecipe,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticRecipes() });

      const deletedItem = request;

      updateCosmeticRecipesQueries({
        removeCosmeticRecipeById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onSuccess: () => {
      handlers.onSuccess?.();
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipesQueries({
          addCosmeticRecipe: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticRecipeMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateCosmeticRecipeResponse,
    DefaultError,
    {
      oldItem: CosmeticRecipe;
      newData: Omit<UpdateCosmeticRecipeRequest, 'id'>;
    },
    {
      oldItem: CosmeticRecipe;
      newItem: CosmeticRecipe;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticRecipe(),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticRecipeRequest, UpdateCosmeticRecipeResponse>(
        Schema.cosmetic.updateCosmeticRecipe,
      )({ id: data.oldItem.id, ...data.newData }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipes(),
      });
      await queryClient.cancelQueries({
        queryKey: StoreKeys.getCosmeticRecipe(request.oldItem.id),
      });

      const newItem: CosmeticRecipe = {
        id: request.oldItem.id,
        name: request.newData.name,
        description: request.newData.description,
        phases: cloneDeep(request.newData.phases),
      };

      updateCosmeticRecipesQueries({
        removeCosmeticRecipeById: request.oldItem.id,
        addCosmeticRecipe: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onSuccess: response => {
      updateCosmeticRecipesQueries({
        removeCosmeticRecipeById: response.id,
        addCosmeticRecipe: response,
      });
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipesQueries({
          removeCosmeticRecipeById: context.newItem.id,
          addCosmeticRecipe: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticRecipeQuery(recipeId: string) {
  return useQuery<GetCosmeticRecipeResponse, Error, GetCosmeticRecipeResponse>({
    queryKey: StoreKeys.getCosmeticRecipe(recipeId),
    queryFn: () => wrapApiAction(Schema.cosmetic.getCosmeticRecipe)({ id: recipeId }),
  });
}

export function useListCosmeticRecipesQuery(enabled = true) {
  const cache = useCosmeticCacheStrict();

  return useQuery<ListCosmeticRecipesResponse, Error, ListCosmeticRecipesResponse>({
    queryKey: StoreKeys.listCosmeticRecipes(),
    queryFn: async (arg: ListCosmeticRecipesRequest) => {
      const response = await wrapApiAction(Schema.cosmetic.listCosmeticRecipes)(arg);

      response.forEach(cache.recipes.add);

      return response;
    },
    select: data => {
      return orderBy(data, item => item.name, 'asc');
    },
    enabled,
  });
}

function updateCosmeticRecipesQueries(arg: {
  addCosmeticRecipe?: CosmeticRecipe;
  removeCosmeticRecipeById?: string;
}) {
  if (
    arg.removeCosmeticRecipeById &&
    arg.addCosmeticRecipe?.id !== arg.removeCosmeticRecipeById
  ) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticRecipe(arg.removeCosmeticRecipeById),
    });
  }

  if (arg.addCosmeticRecipe) {
    queryClient.setQueryData<GetCosmeticRecipeResponse>(
      StoreKeys.getCosmeticRecipe(arg.addCosmeticRecipe.id),
      () => {
        return arg.addCosmeticRecipe;
      },
    );
  }

  queryClient.setQueryData<ListCosmeticRecipesResponse>(
    StoreKeys.listCosmeticRecipes(),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticRecipeById) {
        old = old.filter(item => item.id !== arg.removeCosmeticRecipeById);
      }

      if (arg.addCosmeticRecipe) {
        old.push(arg.addCosmeticRecipe);
      }

      return old;
    },
  );
}

/* =============== Cosmetic Recipe Comment =============== */
export function useCreateCosmeticRecipeCommentMutation(
  recipeId: string,
  handlers: MutationHandlers<CosmeticRecipeComment> = {},
) {
  return useMutation<
    CreateCosmeticRecipeCommentResponse,
    DefaultError,
    Omit<CreateCosmeticRecipeCommentRequest, 'recipeId'>,
    {
      createdItem: CosmeticRecipeComment;
    }
  >({
    mutationKey: StoreKeys.createCosmeticRecipeComment(),
    mutationFn: data =>
      wrapApiAction<
        CreateCosmeticRecipeCommentRequest,
        CreateCosmeticRecipeCommentResponse
      >(Schema.cosmetic.createCosmeticRecipeComment)({ recipeId, ...data }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipeComments({ recipeId }),
      });

      const createdItem: CosmeticRecipeComment = {
        id: Date.now().toString(),
        text: request.text,
        createdAt: new Date().toISOString(),
      };

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        addCosmeticRecipeComment: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipeCommentsQueries({
          recipeId,
          removeCosmeticRecipeCommentById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: context?.createdItem.id,
        addCosmeticRecipeComment: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticRecipeCommentMutation(
  recipeId: string,
  handlers: MutationHandlers = {},
) {
  return useMutation<
    DeleteCosmeticRecipeCommentResponse,
    DefaultError,
    CosmeticRecipeComment,
    {
      deletedItem?: CosmeticRecipeComment;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticRecipeComment(),
    mutationFn: data =>
      wrapApiAction<
        DeleteCosmeticRecipeCommentRequest,
        DeleteCosmeticRecipeCommentResponse
      >(Schema.cosmetic.deleteCosmeticRecipeComment)({
        id: data.id,
        recipeId,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipeComments({ recipeId }),
      });

      const deletedItem = request;

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onSuccess: () => {
      handlers.onSuccess?.();
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipeCommentsQueries({
          recipeId,
          addCosmeticRecipeComment: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticRecipeCommentMutation(
  recipeId: string,
  handlers: MutationHandlers = {},
) {
  return useMutation<
    UpdateCosmeticRecipeCommentResponse,
    DefaultError,
    {
      oldItem: CosmeticRecipeComment;
      newData: Omit<UpdateCosmeticRecipeCommentRequest, 'id' | 'recipeId'>;
    },
    {
      oldItem: CosmeticRecipeComment;
      newItem: CosmeticRecipeComment;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticRecipeComment(),
    mutationFn: data =>
      wrapApiAction<
        UpdateCosmeticRecipeCommentRequest,
        UpdateCosmeticRecipeCommentResponse
      >(Schema.cosmetic.updateCosmeticRecipeComment)({
        id: data.oldItem.id,
        recipeId,
        ...data.newData,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticRecipeComments({
          recipeId,
        }),
      });
      await queryClient.cancelQueries({
        queryKey: StoreKeys.getCosmeticRecipeComment({
          recipeId,
          commentId: request.oldItem.id,
        }),
      });

      const newItem: CosmeticRecipeComment = {
        id: request.oldItem.id,
        text: request.newData.text,
        createdAt: request.oldItem.createdAt,
      };

      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: request.oldItem.id,
        addCosmeticRecipeComment: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onSuccess: response => {
      updateCosmeticRecipeCommentsQueries({
        recipeId,
        removeCosmeticRecipeCommentById: response.id,
        addCosmeticRecipeComment: response,
      });
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipeCommentsQueries({
          recipeId,
          removeCosmeticRecipeCommentById: context.newItem.id,
          addCosmeticRecipeComment: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticRecipeCommentQuery({
  recipeId,
  commentId,
}: {
  recipeId: string;
  commentId: string;
}) {
  return useQuery<
    GetCosmeticRecipeCommentResponse,
    Error,
    GetCosmeticRecipeCommentResponse
  >({
    queryKey: StoreKeys.getCosmeticRecipeComment({
      recipeId,
      commentId,
    }),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.getCosmeticRecipeComment)({
        id: commentId,
        recipeId,
      }),
  });
}

export function useListCosmeticRecipeCommentsQuery(recipeId: string, enabled = true) {
  return useQuery<
    ListCosmeticRecipeCommentsResponse,
    Error,
    ListCosmeticRecipeCommentsResponse
  >({
    queryKey: StoreKeys.listCosmeticRecipeComments({ recipeId }),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.listCosmeticRecipeComments)({ recipeId }),
    select: data => {
      return orderBy(data, item => dayjs(item.createdAt), 'asc'); // FIXME wrap dayjs in datetime utils
    },
    enabled,
  });
}

function updateCosmeticRecipeCommentsQueries({
  recipeId,
  ...arg
}: {
  recipeId: string;
  addCosmeticRecipeComment?: CosmeticRecipeComment;
  removeCosmeticRecipeCommentById?: string;
}) {
  if (
    arg.removeCosmeticRecipeCommentById &&
    arg.addCosmeticRecipeComment?.id !== arg.removeCosmeticRecipeCommentById
  ) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticRecipeComment({
        recipeId,
        commentId: arg.removeCosmeticRecipeCommentById,
      }),
    });
  }

  if (arg.addCosmeticRecipeComment) {
    queryClient.setQueryData<GetCosmeticRecipeCommentResponse>(
      StoreKeys.getCosmeticRecipeComment({
        recipeId,
        commentId: arg.addCosmeticRecipeComment.id,
      }),
      () => {
        return arg.addCosmeticRecipeComment;
      },
    );
  }

  queryClient.setQueryData<ListCosmeticRecipeCommentsResponse>(
    StoreKeys.listCosmeticRecipeComments({ recipeId }),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticRecipeCommentById) {
        old = old.filter(item => item.id !== arg.removeCosmeticRecipeCommentById);
      }

      if (arg.addCosmeticRecipeComment) {
        old.push(arg.addCosmeticRecipeComment);
      }

      return old;
    },
  );
}

// Cosmetic INCI Ingredients
export function useCreateCosmeticINCIIngredientMutation(
  handlers: MutationHandlers<CosmeticINCIIngredient> = {},
) {
  return useMutation<
    CreateCosmeticINCIIngredientResponse,
    DefaultError,
    CreateCosmeticINCIIngredientRequest,
    {
      createdItem: CosmeticINCIIngredient;
    }
  >({
    mutationKey: StoreKeys.createCosmeticINCIIngredient(),
    mutationFn: wrapApiAction<
      CreateCosmeticINCIIngredientRequest,
      CreateCosmeticINCIIngredientResponse
    >(Schema.cosmetic.createCosmeticINCIIngredient),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticINCIIngredients(),
      });

      const createdItem: CosmeticINCIIngredient = {
        id: Date.now().toString(),
        name: request.name,
        benefitIds: request.benefitIds,
      };

      updateCosmeticINCIIngredientsQueries({
        addCosmeticINCIIngredient: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticINCIIngredientsQueries({
          removeCosmeticINCIIngredientById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticINCIIngredientsQueries({
        removeCosmeticINCIIngredientById: context?.createdItem.id,
        addCosmeticINCIIngredient: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticINCIIngredientMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteCosmeticINCIIngredientResponse,
    DefaultError,
    CosmeticINCIIngredient,
    {
      deletedItem?: CosmeticINCIIngredient;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticINCIIngredient(),
    mutationFn: data =>
      wrapApiAction<
        DeleteCosmeticINCIIngredientRequest,
        DeleteCosmeticINCIIngredientResponse
      >(Schema.cosmetic.deleteCosmeticINCIIngredient)({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticINCIIngredients(),
      });

      const deletedItem = request;

      updateCosmeticINCIIngredientsQueries({
        removeCosmeticINCIIngredientById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticINCIIngredientsQueries({
          addCosmeticINCIIngredient: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticINCIIngredientMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateCosmeticINCIIngredientResponse,
    DefaultError,
    {
      ingredient: CosmeticINCIIngredient;
      newData: Omit<UpdateCosmeticINCIIngredientRequest, 'id'>;
    },
    {
      oldItem: CosmeticINCIIngredient;
      newItem: CosmeticINCIIngredient;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticINCIIngredient(),
    mutationFn: data =>
      wrapApiAction<
        UpdateCosmeticINCIIngredientRequest,
        UpdateCosmeticINCIIngredientResponse
      >(Schema.cosmetic.updateCosmeticINCIIngredient)({
        ...data.newData,
        id: data.ingredient.id,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticINCIIngredients(),
      });

      const newItem: CosmeticINCIIngredient = {
        id: request.ingredient.id,
        name: request.newData.name,
        benefitIds: request.newData.benefitIds,
      };

      updateCosmeticINCIIngredientsQueries({
        removeCosmeticINCIIngredientById: request.ingredient.id,
        addCosmeticINCIIngredient: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.ingredient,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticINCIIngredientsQueries({
          removeCosmeticINCIIngredientById: context.newItem.id,
          addCosmeticINCIIngredient: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticINCIIngredientQuery(ingredientId: string) {
  return useQuery<
    GetCosmeticINCIIngredientResponse,
    Error,
    GetCosmeticINCIIngredientResponse
  >({
    queryKey: StoreKeys.getCosmeticINCIIngredient(ingredientId),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.getCosmeticINCIIngredient)({ id: ingredientId }),
  });
}

export function useListCosmeticINCIIngredientsQuery() {
  return useQuery<
    ListCosmeticINCIIngredientsResponse,
    Error,
    ListCosmeticINCIIngredientsResponse
  >({
    queryKey: StoreKeys.listCosmeticINCIIngredients(),
    queryFn: wrapApiAction(Schema.cosmetic.listCosmeticINCIIngredients),
    select: data => {
      return orderBy(data, item => item.name.toLocaleLowerCase(), 'asc');
    },
  });
}

function updateCosmeticINCIIngredientsQueries(arg: {
  addCosmeticINCIIngredient?: CosmeticINCIIngredient;
  removeCosmeticINCIIngredientById?: string;
}) {
  if (arg.removeCosmeticINCIIngredientById) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticINCIIngredient(arg.removeCosmeticINCIIngredientById),
    });
  }

  if (arg.addCosmeticINCIIngredient) {
    queryClient.setQueryData(
      StoreKeys.getCosmeticINCIIngredient(arg.addCosmeticINCIIngredient.id),
      arg.addCosmeticINCIIngredient,
    );
  }

  queryClient.setQueryData<ListCosmeticINCIIngredientsResponse>(
    StoreKeys.listCosmeticINCIIngredients(),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticINCIIngredientById) {
        old = old.filter(item => item.id !== arg.removeCosmeticINCIIngredientById);
      }

      if (arg.addCosmeticINCIIngredient) {
        old.push(arg.addCosmeticINCIIngredient);
      }

      return old;
    },
  );
}
