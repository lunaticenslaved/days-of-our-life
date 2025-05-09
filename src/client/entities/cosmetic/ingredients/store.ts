import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
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
  CreateCosmeticIngredientRequest,
  CreateCosmeticIngredientResponse,
  DeleteCosmeticIngredientRequest,
  DeleteCosmeticIngredientResponse,
  GetCosmeticIngredientResponse,
  ListCosmeticIngredientsRequest,
  ListCosmeticIngredientsResponse,
  UpdateCosmeticIngredientRequest,
  UpdateCosmeticIngredientResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { orderBy } from 'lodash';
import { useCosmeticEventBusStrict } from '#/client/entities/cosmetic/event-bus';
import { ItemStore } from '#/client/hooks/cache';

const StoreKeys = {
  list: (): QueryKey => ['cosmetic', 'ingredients', 'list'],
  create: (): MutationKey => ['cosmetic', 'ingredients', 'create'],
  get: (ingredientId: string): QueryKey => [
    'cosmetic',
    'ingredients',
    ingredientId,
    'get',
  ],
  delete: (ingredientId: string): MutationKey => [
    'cosmetic',
    'ingredients',
    ingredientId,
    'delete',
  ],
  update: (ingredientId: string): MutationKey => [
    'cosmetic',
    'ingredients',
    ingredientId,
    'update',
  ],
};

export function useCreateCosmeticIngredientMutation(
  handlers: MutationHandlers<CosmeticIngredient> = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

  return useMutation<
    CreateCosmeticIngredientResponse,
    DefaultError,
    CreateCosmeticIngredientRequest,
    {
      createdItem: CosmeticIngredient;
    }
  >({
    mutationKey: StoreKeys.create(),
    mutationFn: wrapApiAction<
      CreateCosmeticIngredientRequest,
      CreateCosmeticIngredientResponse
    >(Schema.cosmetic.createCosmeticIngredient),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.list(),
      });

      const createdItem: CosmeticIngredient = {
        id: Date.now().toString(),
        name: request.name,
        description: request.description || null,
        INCIIngredientIds: request.INCIIngredientIds,
        benefitIds: request.benefitIds,
        storage: {
          grams: 0,
        },
      };

      updateCosmeticIngredientsQueries(cache.ingredients, {
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
        updateCosmeticIngredientsQueries(cache.ingredients, {
          removeCosmeticIngredientById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      eventBus.emit('ingredient-created', {
        ingredient: response,
      });

      updateCosmeticIngredientsQueries(cache.ingredients, {
        removeCosmeticIngredientById: context?.createdItem.id,
        addCosmeticIngredient: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticIngredientMutation(
  ingredientId: string,
  handlers: MutationHandlers = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

  return useMutation<
    DeleteCosmeticIngredientResponse,
    DefaultError,
    CosmeticIngredient,
    {
      deletedItem?: CosmeticIngredient;
    }
  >({
    mutationKey: StoreKeys.delete(ingredientId),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticIngredientRequest, DeleteCosmeticIngredientResponse>(
        Schema.cosmetic.deleteCosmeticIngredient,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.list() });

      const deletedItem = request;

      updateCosmeticIngredientsQueries(cache.ingredients, {
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
        updateCosmeticIngredientsQueries(cache.ingredients, {
          addCosmeticIngredient: context.deletedItem,
        });
      }
    },
    onSuccess: () => {
      handlers.onSuccess?.();
      eventBus.emit('ingredient-deleted', {
        ingredientId,
      });
    },
  });
}

export function useUpdateCosmeticIngredientMutation(
  ingredientId: string,
  handlers: MutationHandlers<CosmeticIngredient> = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

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
    mutationKey: StoreKeys.update(ingredientId),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticIngredientRequest, UpdateCosmeticIngredientResponse>(
        Schema.cosmetic.updateCosmeticIngredient,
      )({ ...data.newData, id: data.ingredient.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.list() });

      const newItem: CosmeticIngredient = {
        id: request.ingredient.id,
        name: request.newData.name,
        description: request.newData.description || null,
        INCIIngredientIds: request.newData.INCIIngredientIds,
        benefitIds: request.newData.benefitIds,
        storage: {
          grams: 0,
        },
      };

      updateCosmeticIngredientsQueries(cache.ingredients, {
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
        updateCosmeticIngredientsQueries(cache.ingredients, {
          removeCosmeticIngredientById: context.newItem.id,
          addCosmeticIngredient: context.oldItem,
        });
      }
    },
    onSuccess: response => {
      eventBus.emit('ingredient-updated', {
        ingredient: response,
      });
    },
  });
}

export function useGetCosmeticIngredientQuery(ingredientId: string) {
  const cache = useCosmeticCacheStrict();

  return useQuery<GetCosmeticIngredientResponse, Error, GetCosmeticIngredientResponse>({
    queryKey: StoreKeys.get(ingredientId),
    queryFn: async () => {
      const result = await wrapApiAction(Schema.cosmetic.getCosmeticIngredient)({
        id: ingredientId,
      });

      cache.ingredients.add(result);

      return result;
    },
    select: data => {
      return cache.ingredients.get(data.id);
    },
  });
}

export function useListCosmeticIngredientsQuery() {
  const cache = useCosmeticCacheStrict();

  return useQuery<
    ListCosmeticIngredientsResponse,
    Error,
    ListCosmeticIngredientsResponse
  >({
    queryKey: StoreKeys.list(),
    queryFn: async (arg: ListCosmeticIngredientsRequest) => {
      const result = await wrapApiAction(Schema.cosmetic.listCosmeticIngredients)(arg);

      result.forEach(cache.ingredients.add);

      return result;
    },
    select: data => {
      return orderBy(
        cache.ingredients.list(data.map(item => item.id)),
        item => item.name.toLocaleLowerCase(),
        'asc',
      );
    },
  });
}

function updateCosmeticIngredientsQueries(
  store: ItemStore<CosmeticIngredient>,
  arg: {
    addCosmeticIngredient?: CosmeticIngredient;
    removeCosmeticIngredientById?: string;
  },
) {
  if (arg.removeCosmeticIngredientById) {
    store.remove(arg.removeCosmeticIngredientById);

    queryClient.removeQueries({
      queryKey: StoreKeys.get(arg.removeCosmeticIngredientById),
    });
  }

  if (arg.addCosmeticIngredient) {
    store.add(arg.addCosmeticIngredient);

    queryClient.setQueryData(
      StoreKeys.get(arg.addCosmeticIngredient.id),
      arg.addCosmeticIngredient,
    );
  }

  queryClient.setQueryData<ListCosmeticIngredientsResponse>(StoreKeys.list(), _old => {
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
  });
}
