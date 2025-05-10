import { ItemStore } from '#/client/hooks/cache';
import {
  CreateFoodProductRequest,
  CreateFoodProductResponse,
  DeleteFoodProductRequest,
  DeleteFoodProductResponse,
  GetFoodProductResponse,
  ListFoodProductsRequest,
  ListFoodProductsResponse,
  UpdateFoodProductRequest,
  UpdateFoodProductResponse,
} from '#/shared/api/types/food';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { FoodProduct } from '#/shared/models/food';
import { cloneDeep } from 'lodash';
import { useFoodCacheStrict } from '#/client/entities/food/cache';

const StoreKeys = {
  // Product
  list: (): QueryKey => ['food', 'products', 'list'],
  get: (productId: string): QueryKey => ['food', 'products', productId, 'get'],
  create: (): QueryKey => ['food', 'products', 'create'],
  update: (productId: string): QueryKey => ['food', 'products', productId, 'update'],
  delete: (productId: string): QueryKey => ['food', 'products', productId, 'delete'],
};

async function onProductsChange(
  store: ItemStore<FoodProduct>,
  arg: {
    addProduct?: FoodProduct;
    removeProductId?: string;
  },
) {
  await queryClient.cancelQueries({ queryKey: StoreKeys.list() });

  queryClient.setQueryData<ListFoodProductsResponse>(StoreKeys.list(), _old => {
    if (!_old) {
      return _old;
    }

    let result = cloneDeep(_old);

    if (arg.removeProductId) {
      result = result.filter(product => product.id !== arg.removeProductId);
      store.remove(arg.removeProductId);
    }

    if (arg.addProduct) {
      store.add(arg.addProduct);
      result.push(arg.addProduct);
    }

    return result;
  });

  if (arg.removeProductId) {
    await queryClient.cancelQueries({
      queryKey: StoreKeys.get(arg.removeProductId),
    });

    queryClient.setQueryData<GetFoodProductResponse>(
      StoreKeys.get(arg.removeProductId),
      () => {
        return undefined;
      },
    );
  }

  if (arg.addProduct) {
    await queryClient.cancelQueries({
      queryKey: StoreKeys.get(arg.addProduct.id),
    });

    queryClient.setQueryData<GetFoodProductResponse>(
      StoreKeys.get(arg.addProduct.id),
      () => {
        return arg.addProduct;
      },
    );
  }
}

// Product
export function useListFoodProductsQuery() {
  const cache = useFoodCacheStrict();

  return useQuery<ListFoodProductsResponse, Error, ListFoodProductsResponse>({
    queryKey: StoreKeys.list(),
    queryFn: async (arg: ListFoodProductsRequest) => {
      const result = await wrapApiAction(Schema.food.listFoodProducts)(arg);

      result.forEach(product => {
        cache.products.add(product);
      });

      return result;
    },
    select: data => {
      return cache.products.list(data.map(product => product.id));
    },
  });
}

export function useGetFoodProductQuery(productId: string) {
  const cache = useFoodCacheStrict();

  return useQuery<GetFoodProductResponse, Error, GetFoodProductResponse>({
    queryKey: StoreKeys.get(productId),
    queryFn: async () => {
      const result = await wrapApiAction(Schema.food.getFoodProduct)({ id: productId });

      cache.products.add(result);

      return result;
    },
    select: data => {
      return cache.products.get(data.id);
    },
  });
}

export function useCreateFoodProductMutation(
  handlers: MutationHandlers<FoodProduct> = {},
) {
  const cache = useFoodCacheStrict();

  return useMutation<
    CreateFoodProductResponse,
    Error,
    CreateFoodProductRequest,
    {
      createdProduct: FoodProduct;
    }
  >({
    mutationKey: StoreKeys.create(),
    mutationFn: wrapApiAction(Schema.food.createFoodProduct, handlers),
    async onMutate(variables) {
      const createdProduct: FoodProduct = {
        id: Date.now().toString(),
        name: variables.name,
        manufacturer: variables.manufacturer,
        nutrientsPerGram: variables.nutrientsPerGram,
        quantities: [
          {
            id: 'grams',
            name: 'Граммы',
            grams: 1,
          },
        ],
      };

      await onProductsChange(cache.products, {
        addProduct: createdProduct,
      });

      handlers.onMutate?.();

      return { createdProduct };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        onProductsChange(cache.products, {
          removeProductId: context.createdProduct.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      onProductsChange(cache.products, {
        addProduct: response,
        removeProductId: context.createdProduct.id,
      });
    },
  });
}

export function useUpdateFoodProductMutation(
  productId: string,
  handlers: MutationHandlers<FoodProduct> = {},
) {
  const cache = useFoodCacheStrict();

  return useMutation<
    UpdateFoodProductResponse,
    Error,
    UpdateFoodProductRequest,
    {
      oldProduct?: FoodProduct;
      createdProduct: FoodProduct;
    }
  >({
    mutationKey: StoreKeys.update(productId),
    mutationFn: wrapApiAction(Schema.food.updateFoodProduct),
    async onMutate(variables) {
      const createdProduct: FoodProduct = {
        id: variables.id,
        name: variables.name,
        manufacturer: variables.manufacturer,
        nutrientsPerGram: variables.nutrientsPerGram,
        quantities: [
          {
            id: 'grams',
            name: 'Граммы',
            grams: 1,
          },
        ],
      };

      const products = queryClient.getQueryData<ListFoodProductsResponse>(
        StoreKeys.list(),
      );

      const oldProduct = products?.find(product => product.id === variables.id);

      await onProductsChange(cache.products, {
        removeProductId: oldProduct?.id,
        addProduct: createdProduct,
      });

      handlers.onMutate?.();

      return { createdProduct, oldProduct };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        onProductsChange(cache.products, {
          removeProductId: context.createdProduct.id,
          addProduct: context.createdProduct,
        });
      }
    },
    onSuccess: (response, _request, _context) => {
      onProductsChange(cache.products, {
        removeProductId: response.id,
        addProduct: response,
      });

      handlers.onSuccess?.(response);
    },
  });
}

export function useDeleteFoodProductMutation(
  productId: string,
  handlers: MutationHandlers<DeleteFoodProductRequest> = {},
) {
  const cache = useFoodCacheStrict();

  return useMutation<
    DeleteFoodProductResponse,
    Error,
    DeleteFoodProductRequest,
    {
      deletedProduct?: FoodProduct;
    }
  >({
    mutationKey: StoreKeys.delete(productId),
    mutationFn: wrapApiAction(Schema.food.deleteFoodProduct),
    async onMutate(variables) {
      const products = queryClient.getQueryData<ListFoodProductsResponse>(
        StoreKeys.list(),
      );

      const deletedProduct = products?.find(product => product.id === variables.id);

      await onProductsChange(cache.products, {
        removeProductId: variables.id,
      });

      return { deletedProduct };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        onProductsChange(cache.products, {
          addProduct: context.deletedProduct,
        });
      }
    },
    onSuccess: (_response, request, _context) => {
      handlers.onSuccess?.(request);
    },
  });
}
