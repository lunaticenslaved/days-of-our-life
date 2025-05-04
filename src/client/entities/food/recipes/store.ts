import {
  CreateFoodRecipeRequest,
  CreateFoodRecipeResponse,
  DeleteFoodRecipeRequest,
  DeleteFoodRecipeResponse,
  GetFoodRecipeResponse,
  ListFoodRecipesRequest,
  ListFoodRecipesResponse,
  UpdateFoodRecipeRequest,
  UpdateFoodRecipeResponse,
} from '#/shared/api/types/food';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { FoodRecipe } from '#/shared/models/food';
import { cloneDeep, orderBy } from 'lodash';
import { ItemStore } from '#/client/hooks/cache';
import { useFoodCacheStrict } from '#/client/entities/food/cache';

const StoreKeys = {
  list: (): QueryKey => ['food', 'recipes', 'list'],
  create: (): QueryKey => ['food', 'recipes', 'create'],
  get: (recipeId: string): QueryKey => ['food', 'recipes', recipeId, 'get'],
  update: (recipeId: string): QueryKey => ['food', 'recipes', recipeId, 'update'],
  delete: (recipeId: string): QueryKey => ['food', 'recipes', recipeId, 'delete'],
};

export function useListFoodRecipesQuery() {
  const cache = useFoodCacheStrict();

  return useQuery<ListFoodRecipesResponse>({
    queryKey: StoreKeys.list(),
    queryFn: async (arg: ListFoodRecipesRequest) => {
      const result = await wrapApiAction(Schema.food.listFoodRecipes)(arg);

      result.forEach(recipe => {
        cache.recipes.add(recipe);
      });

      return result;
    },
    select: data => {
      return orderBy(
        cache.recipes.list(data.map(recipe => recipe.id)),
        recipe => recipe.name.toLocaleLowerCase(),
        'asc',
      );
    },
  });
}

export function useGetFoodRecipeQuery(recipeId: string) {
  const cache = useFoodCacheStrict();

  return useQuery({
    queryKey: StoreKeys.get(recipeId),
    queryFn: async () => {
      const result = await wrapApiAction(Schema.food.getFoodRecipe)({ id: recipeId });

      cache.recipes.add(result);

      return result;
    },
    select: data => {
      return cache.recipes.get(data.id);
    },
  });
}

export function useCreateFoodRecipeMutation(handlers: MutationHandlers<FoodRecipe> = {}) {
  const cache = useFoodCacheStrict();

  return useMutation<CreateFoodRecipeResponse, Error, CreateFoodRecipeRequest>({
    mutationKey: StoreKeys.create(),
    mutationFn: wrapApiAction(Schema.food.createFoodRecipe),
    onMutate() {
      handlers.onMutate?.();
    },
    onError: (_error, _request, _context) => {
      handlers.onError?.();
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);

      onItemChange(cache.recipes, {
        addRecipe: response,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: StoreKeys.list(),
      });
    },
  });
}

export function useUpdateFoodRecipeMutation(
  recipeId: string,
  handlers: MutationHandlers<FoodRecipe> = {},
) {
  const cache = useFoodCacheStrict();

  return useMutation<UpdateFoodRecipeResponse, Error, UpdateFoodRecipeRequest>({
    mutationKey: StoreKeys.update(recipeId),
    mutationFn: wrapApiAction(Schema.food.updateFoodRecipe),
    onMutate() {
      handlers.onMutate?.();
    },
    onError: (_error, _request, _context) => {
      handlers.onError?.();
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);

      onItemChange(cache.recipes, {
        removeRecipeId: response.id,
        addRecipe: response,
      });
    },
  });
}

export function useDeleteFoodRecipeMutation(
  recipeId: string,
  handlers: MutationHandlers<void> = {},
) {
  const cache = useFoodCacheStrict();

  return useMutation<DeleteFoodRecipeResponse, Error, DeleteFoodRecipeRequest>({
    mutationKey: StoreKeys.delete(recipeId),
    mutationFn: wrapApiAction(Schema.food.deleteFoodRecipe),
    onMutate() {
      handlers.onMutate?.();
    },
    onError: (_error, _request, _context) => {
      handlers.onError?.();
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);

      onItemChange(cache.recipes, {
        removeRecipeId: recipeId,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: StoreKeys.list(),
      });
    },
  });
}

function onItemChange(
  store: ItemStore<FoodRecipe>,
  arg: {
    addRecipe?: FoodRecipe;
    removeRecipeId?: string;
  },
) {
  if (arg.removeRecipeId && arg.addRecipe?.id !== arg.removeRecipeId) {
    store.remove(arg.removeRecipeId);
  }

  if (arg.addRecipe) {
    store.add(arg.addRecipe);
  }

  queryClient.setQueryData<ListFoodRecipesResponse>(StoreKeys.list(), _old => {
    if (!_old) {
      return _old;
    }

    let result = cloneDeep(_old);

    if (arg.removeRecipeId) {
      result = result.filter(recipe => recipe.id !== arg.removeRecipeId);
    }

    if (arg.addRecipe) {
      result.push(arg.addRecipe);
    }

    return result;
  });

  if (arg.removeRecipeId) {
    queryClient.setQueryData<GetFoodRecipeResponse>(
      StoreKeys.get(arg.removeRecipeId),
      () => {
        return undefined;
      },
    );
  }

  if (arg.addRecipe) {
    queryClient.setQueryData<GetFoodRecipeResponse>(
      StoreKeys.get(arg.addRecipe.id),
      () => {
        return arg.addRecipe;
      },
    );
  }
}
