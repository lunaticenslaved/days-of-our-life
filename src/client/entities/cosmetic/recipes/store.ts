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
  CreateCosmeticRecipeRequest,
  CreateCosmeticRecipeResponse,
  DeleteCosmeticRecipeRequest,
  DeleteCosmeticRecipeResponse,
  GetCosmeticRecipeResponse,
  ListCosmeticRecipesRequest,
  ListCosmeticRecipesResponse,
  UpdateCosmeticRecipeRequest,
  UpdateCosmeticRecipeResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticRecipe } from '#/shared/models/cosmetic';
import { cloneDeep, orderBy } from 'lodash';
import { useCosmeticCacheStrict, ItemStore } from '#/client/entities/cosmetic/cache';
import { useCosmeticEventBusStrict } from '#/client/entities/cosmetic/event-bus';

const StoreKeys = {
  getCosmeticRecipe: (recipeId: string): QueryKey => ['cosmetic', 'recipes', recipeId],
  listCosmeticRecipes: (): QueryKey => ['cosmetic', 'recipes', 'list'],
  createCosmeticRecipe: (): MutationKey => ['cosmetic', 'recipes', 'create'],
  deleteCosmeticRecipe: (recipeId: string): MutationKey => [
    'cosmetic',
    'recipes',
    recipeId,
    'delete',
  ],
  updateCosmeticRecipe: (recipeId: string): MutationKey => [
    'cosmetic',
    'recipes',
    recipeId,
    'update',
  ],
};

export function useCreateCosmeticRecipeMutation(
  handlers: MutationHandlers<CosmeticRecipe> = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

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

      updateCosmeticRecipesQueries(cache.recipes, {
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
        updateCosmeticRecipesQueries(cache.recipes, {
          removeCosmeticRecipeById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticRecipesQueries(cache.recipes, {
        removeCosmeticRecipeById: context?.createdItem.id,
        addCosmeticRecipe: response,
      });

      eventBus.emit('recipe-created', {
        recipe: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticRecipeMutation(
  recipeId: string,
  handlers: MutationHandlers = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

  return useMutation<
    DeleteCosmeticRecipeResponse,
    DefaultError,
    CosmeticRecipe,
    {
      deletedItem?: CosmeticRecipe;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticRecipe(recipeId),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticRecipeRequest, DeleteCosmeticRecipeResponse>(
        Schema.cosmetic.deleteCosmeticRecipe,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticRecipes() });

      const deletedItem = request;

      updateCosmeticRecipesQueries(cache.recipes, {
        removeCosmeticRecipeById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onSuccess: () => {
      handlers.onSuccess?.();
      eventBus.emit('recipe-deleted', { recipeId });
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipesQueries(cache.recipes, {
          addCosmeticRecipe: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticRecipeMutation(
  recipeId: string,
  handlers: MutationHandlers<CosmeticRecipe> = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

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
    mutationKey: StoreKeys.updateCosmeticRecipe(recipeId),
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

      updateCosmeticRecipesQueries(cache.recipes, {
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
      handlers.onSuccess?.(response);
      eventBus.emit('recipe-updated', { recipe: response });

      updateCosmeticRecipesQueries(cache.recipes, {
        removeCosmeticRecipeById: response.id,
        addCosmeticRecipe: response,
      });
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticRecipesQueries(cache.recipes, {
          removeCosmeticRecipeById: context.newItem.id,
          addCosmeticRecipe: context.oldItem,
        });
      }
    },
  });
}

export function useGetCosmeticRecipeQuery(recipeId: string) {
  const cache = useCosmeticCacheStrict();

  return useQuery<GetCosmeticRecipeResponse, Error, GetCosmeticRecipeResponse>({
    queryKey: StoreKeys.getCosmeticRecipe(recipeId),
    queryFn: async () => {
      const recipe = await wrapApiAction(Schema.cosmetic.getCosmeticRecipe)({
        id: recipeId,
      });

      cache.recipes.add(recipe);

      return recipe;
    },
    select: data => {
      return cache.recipes.get(data.id);
    },
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
      return orderBy(
        cache.recipes.list(data.map(recipe => recipe.id)),
        item => item.name,
        'asc',
      );
    },
    enabled,
  });
}

function updateCosmeticRecipesQueries(
  cache: ItemStore<CosmeticRecipe>,
  arg: {
    addCosmeticRecipe?: CosmeticRecipe;
    removeCosmeticRecipeById?: string;
  },
) {
  if (
    arg.removeCosmeticRecipeById &&
    arg.addCosmeticRecipe?.id !== arg.removeCosmeticRecipeById
  ) {
    cache.remove(arg.removeCosmeticRecipeById);

    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticRecipe(arg.removeCosmeticRecipeById),
    });
  }

  if (arg.addCosmeticRecipe) {
    cache.add(arg.addCosmeticRecipe);

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
