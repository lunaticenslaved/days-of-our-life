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
  CreateCosmeticINCIIngredientRequest,
  CreateCosmeticINCIIngredientResponse,
  DeleteCosmeticINCIIngredientRequest,
  DeleteCosmeticINCIIngredientResponse,
  GetCosmeticINCIIngredientResponse,
  ListCosmeticINCIIngredientsRequest,
  ListCosmeticINCIIngredientsResponse,
  UpdateCosmeticINCIIngredientRequest,
  UpdateCosmeticINCIIngredientResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { orderBy } from 'lodash';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { useCosmeticEventBusStrict } from '#/client/entities/cosmetic/event-bus';
import { ItemStore } from '#/client/hooks/cache';

const StoreKeys = {
  list: (): QueryKey => ['cosmetic', 'inci-ingredients', 'list'],
  create: (): MutationKey => ['cosmetic', 'inci-ingredients', 'create'],
  get: (id: string): QueryKey => ['cosmetic', 'inci-ingredients', id],
  delete: (id: string): MutationKey => ['cosmetic', 'inci-ingredients', id, 'delete'],
  update: (id: string): MutationKey => ['cosmetic', 'inci-ingredients', id, 'update'],
};

export function useCreateCosmeticINCIIngredientMutation(
  handlers: MutationHandlers<CosmeticINCIIngredient> = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

  return useMutation<
    CreateCosmeticINCIIngredientResponse,
    DefaultError,
    CreateCosmeticINCIIngredientRequest,
    {
      createdItem: CosmeticINCIIngredient;
    }
  >({
    mutationKey: StoreKeys.create(),
    mutationFn: wrapApiAction<
      CreateCosmeticINCIIngredientRequest,
      CreateCosmeticINCIIngredientResponse
    >(Schema.cosmetic.createCosmeticINCIIngredient),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.list(),
      });

      const createdItem: CosmeticINCIIngredient = {
        id: Date.now().toString(),
        name: request.name,
        benefitIds: request.benefitIds,
      };

      updateCosmeticINCIIngredientsQueries(cache.inciIngredients, {
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
        updateCosmeticINCIIngredientsQueries(cache.inciIngredients, {
          removeCosmeticINCIIngredientById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateCosmeticINCIIngredientsQueries(cache.inciIngredients, {
        removeCosmeticINCIIngredientById: context?.createdItem.id,
        addCosmeticINCIIngredient: response,
      });

      eventBus.emit('inci-ingredient-created', {
        ingredient: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticINCIIngredientMutation(
  ingredientId: string,
  handlers: MutationHandlers = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

  return useMutation<
    DeleteCosmeticINCIIngredientResponse,
    DefaultError,
    CosmeticINCIIngredient,
    {
      deletedItem?: CosmeticINCIIngredient;
    }
  >({
    mutationKey: StoreKeys.delete(ingredientId),
    mutationFn: data =>
      wrapApiAction<
        DeleteCosmeticINCIIngredientRequest,
        DeleteCosmeticINCIIngredientResponse
      >(Schema.cosmetic.deleteCosmeticINCIIngredient)({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.list(),
      });

      const deletedItem = request;

      updateCosmeticINCIIngredientsQueries(cache.inciIngredients, {
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
        updateCosmeticINCIIngredientsQueries(cache.inciIngredients, {
          addCosmeticINCIIngredient: context.deletedItem,
        });
      }
    },
    onSuccess: () => {
      handlers.onSuccess?.();
      eventBus.emit('inci-ingredient-deleted', {
        ingredientId,
      });
    },
  });
}

export function useUpdateCosmeticINCIIngredientMutation(
  ingredientId: string,
  handlers: MutationHandlers<CosmeticINCIIngredient> = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

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
    mutationKey: StoreKeys.update(ingredientId),
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
        queryKey: StoreKeys.list(),
      });

      const newItem: CosmeticINCIIngredient = {
        id: request.ingredient.id,
        name: request.newData.name,
        benefitIds: request.newData.benefitIds,
      };

      updateCosmeticINCIIngredientsQueries(cache.inciIngredients, {
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
        updateCosmeticINCIIngredientsQueries(cache.inciIngredients, {
          removeCosmeticINCIIngredientById: context.newItem.id,
          addCosmeticINCIIngredient: context.oldItem,
        });
      }
    },
    onSuccess: response => {
      handlers.onSuccess?.(response);

      eventBus.emit('inci-ingredient-updated', {
        ingredient: response,
      });
    },
  });
}

export function useGetCosmeticINCIIngredientQuery(ingredientId: string) {
  const cache = useCosmeticCacheStrict();

  return useQuery<
    GetCosmeticINCIIngredientResponse,
    Error,
    GetCosmeticINCIIngredientResponse
  >({
    queryKey: StoreKeys.get(ingredientId),
    queryFn: async () => {
      const result = await wrapApiAction(Schema.cosmetic.getCosmeticINCIIngredient)({
        id: ingredientId,
      });

      cache.inciIngredients.add(result);

      return result;
    },
    select: data => {
      return cache.inciIngredients.get(data.id);
    },
  });
}

export function useListCosmeticINCIIngredientsQuery() {
  const cache = useCosmeticCacheStrict();

  return useQuery<
    ListCosmeticINCIIngredientsResponse,
    Error,
    ListCosmeticINCIIngredientsResponse
  >({
    queryKey: StoreKeys.list(),
    queryFn: async (arg: ListCosmeticINCIIngredientsRequest) => {
      const result = await wrapApiAction(Schema.cosmetic.listCosmeticINCIIngredients)(
        arg,
      );

      result.forEach(cache.inciIngredients.add);

      return result;
    },
    select: data => {
      return orderBy(
        cache.inciIngredients.list(data.map(item => item.id)),
        item => item.name.toLocaleLowerCase(),
        'asc',
      );
    },
  });
}

function updateCosmeticINCIIngredientsQueries(
  store: ItemStore<CosmeticINCIIngredient>,
  arg: {
    addCosmeticINCIIngredient?: CosmeticINCIIngredient;
    removeCosmeticINCIIngredientById?: string;
  },
) {
  if (arg.removeCosmeticINCIIngredientById) {
    store.remove(arg.removeCosmeticINCIIngredientById);

    queryClient.removeQueries({
      queryKey: StoreKeys.get(arg.removeCosmeticINCIIngredientById),
    });
  }

  if (arg.addCosmeticINCIIngredient) {
    store.add(arg.addCosmeticINCIIngredient);

    queryClient.setQueryData(
      StoreKeys.get(arg.addCosmeticINCIIngredient.id),
      arg.addCosmeticINCIIngredient,
    );
  }

  queryClient.setQueryData<ListCosmeticINCIIngredientsResponse>(
    StoreKeys.list(),
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
