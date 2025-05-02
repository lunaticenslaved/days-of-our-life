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
  CreateCosmeticProductRequest,
  CreateCosmeticProductResponse,
  DeleteCosmeticProductRequest,
  DeleteCosmeticProductResponse,
  GetCosmeticProductResponse,
  ListCosmeticProductsRequest,
  ListCosmeticProductsResponse,
  UpdateCosmeticProductRequest,
  UpdateCosmeticProductResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticProduct } from '#/shared/models/cosmetic';
import { orderBy } from 'lodash';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { useCosmeticEventBusStrict } from '#/client/entities/cosmetic/event-bus';
import { ItemStore } from '#/client/hooks/cache';

const StoreKeys = {
  // Cosmetic Products
  getCosmeticProduct: (productId: string): QueryKey => [
    'cosmetic',
    'products',
    productId,
    'get',
  ],
  listCosmeticProducts: (): QueryKey => ['cosmetic', 'products'],
  createCosmeticProduct: (): MutationKey => ['cosmetic', 'products', 'create'],
  deleteCosmeticProduct: (): MutationKey => ['cosmetic', 'products', 'delete'],
  updateCosmeticProduct: (productId: string): MutationKey => [
    'cosmetic',
    'products',
    productId,
    'update',
  ],
};

export function useCreateCosmeticProductMutation(
  handlers: MutationHandlers<CosmeticProduct> = {},
) {
  const cache = useCosmeticCacheStrict();
  const eventBus = useCosmeticEventBusStrict();

  return useMutation<
    CreateCosmeticProductResponse,
    DefaultError,
    CreateCosmeticProductRequest,
    {
      createdItem: CosmeticProduct;
    }
  >({
    mutationKey: StoreKeys.createCosmeticProduct(),
    mutationFn: wrapApiAction<
      CreateCosmeticProductRequest,
      CreateCosmeticProductResponse
    >(Schema.cosmetic.createCosmeticProduct),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticProducts(),
      });

      const createdItem: CosmeticProduct = {
        id: Date.now().toString(),
        name: request.name,
        manufacturer: request.manufacturer,
      };

      setListCosmeticProductsQueryData(cache.products, {
        addCosmeticProduct: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setListCosmeticProductsQueryData(cache.products, {
          removeCosmeticProductById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      setListCosmeticProductsQueryData(cache.products, {
        removeCosmeticProductById: context.createdItem.id,
        addCosmeticProduct: response,
      });

      eventBus.emit('product-created', {
        product: response,
      });

      return response;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.listCosmeticProducts() });
    },
  });
}

export function useDeleteCosmeticProductMutation(
  handlers: MutationHandlers<{ productId: string }> = {},
) {
  const eventBus = useCosmeticEventBusStrict();
  const cache = useCosmeticCacheStrict();

  return useMutation<
    DeleteCosmeticProductResponse,
    DefaultError,
    CosmeticProduct,
    {
      deletedItem?: CosmeticProduct;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticProduct(),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticProductRequest, DeleteCosmeticProductResponse>(
        Schema.cosmetic.deleteCosmeticProduct,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticProducts() });

      const deletedItem = request;

      setListCosmeticProductsQueryData(cache.products, {
        removeCosmeticProductById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setListCosmeticProductsQueryData(cache.products, {
          addCosmeticProduct: context.deletedItem,
        });
      }
    },
    onSuccess: (_response, request) => {
      handlers.onSuccess?.({
        productId: request.id,
      });

      eventBus.emit('product-deleted', {
        productId: request.id,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.deleteCosmeticProduct() });
    },
  });
}

export function useUpdateCosmeticProductMutation(
  productId: string,
  handlers: MutationHandlers<CosmeticProduct> = {},
) {
  const eventBus = useCosmeticEventBusStrict();
  const cache = useCosmeticCacheStrict();

  return useMutation<
    UpdateCosmeticProductResponse,
    DefaultError,
    { product: CosmeticProduct; newData: Omit<UpdateCosmeticProductRequest, 'id'> },
    {
      oldItem: CosmeticProduct;
      newItem: CosmeticProduct;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticProduct(productId),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticProductRequest, UpdateCosmeticProductResponse>(
        Schema.cosmetic.updateCosmeticProduct,
      )({ id: data.product.id, ...data.newData }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticProducts() });

      const newItem = {
        id: request.product.id,
        ...request.newData,
      };

      setListCosmeticProductsQueryData(cache.products, {
        removeCosmeticProductById: request.product.id,
        addCosmeticProduct: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.product,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setListCosmeticProductsQueryData(cache.products, {
          removeCosmeticProductById: context.newItem.id,
          addCosmeticProduct: context.oldItem,
        });
      }
    },
    onSuccess: response => {
      handlers.onSuccess?.(response);

      eventBus.emit('product-updated', {
        product: response,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.listCosmeticProducts() });
    },
  });
}

export function useGetCosmeticProductQuery(productId: string) {
  return useQuery<GetCosmeticProductResponse, Error, GetCosmeticProductResponse>({
    queryKey: StoreKeys.getCosmeticProduct(productId),
    queryFn: () => wrapApiAction(Schema.cosmetic.getCosmeticProduct)({ id: productId }),
  });
}

export function useListCosmeticProductsQuery() {
  const cache = useCosmeticCacheStrict();

  return useQuery<ListCosmeticProductsResponse, Error, ListCosmeticProductsResponse>({
    queryKey: StoreKeys.listCosmeticProducts(),
    queryFn: async (arg: ListCosmeticProductsRequest) => {
      const response = await wrapApiAction(Schema.cosmetic.listCosmeticProducts)(arg);

      response.forEach(cache.products.add);

      return response;
    },
    select: () => {
      const result: ListCosmeticProductsResponse = cache.products.list();

      return orderBy(result, item => item.name, 'asc');
    },
  });
}

function setListCosmeticProductsQueryData(
  store: ItemStore<CosmeticProduct>,
  arg: {
    addCosmeticProduct?: CosmeticProduct;
    removeCosmeticProductById?: string;
  },
) {
  if (arg.removeCosmeticProductById) {
    store.remove(arg.removeCosmeticProductById);

    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticProduct(arg.removeCosmeticProductById),
    });
  }

  if (arg.addCosmeticProduct) {
    store.add(arg.addCosmeticProduct);

    queryClient.setQueryData(
      StoreKeys.getCosmeticProduct(arg.addCosmeticProduct.id),
      arg.addCosmeticProduct,
    );
  }

  queryClient.setQueryData<ListCosmeticProductsResponse>(
    StoreKeys.listCosmeticProducts(),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticProductById) {
        old = old.filter(item => item.id !== arg.removeCosmeticProductById);
      }

      if (arg.addCosmeticProduct) {
        old.push(arg.addCosmeticProduct);
      }

      return old;
    },
  );
}
