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
  ListCosmeticProductsResponse,
  UpdateCosmeticProductRequest,
  UpdateCosmeticProductResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticProduct } from '#/shared/models/cosmetic';
import { orderBy } from 'lodash';

const StoreKeys = {
  getCosmeticProduct: (productId: string): QueryKey => ['getCosmeticProduct', productId],
  listCosmeticProducts: (): QueryKey => ['listCosmeticProducts'],
  createCosmeticProduct: (): MutationKey => ['createCosmeticProduct'],
  deleteCosmeticProduct: (): MutationKey => ['deleteCosmeticProduct'],
  updateCosmeticProduct: (): MutationKey => ['updateCosmeticProduct'],
};

export function useCreateCosmeticProductMutation(
  handlers: MutationHandlers<CosmeticProduct> = {},
) {
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

      setListCosmeticProductsQueryData({
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
        setListCosmeticProductsQueryData({
          removeCosmeticProductById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      setListCosmeticProductsQueryData({
        removeCosmeticProductById: context?.createdItem.id,
        addCosmeticProduct: response,
      });

      return response;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.listCosmeticProducts() });
    },
  });
}

export function useDeleteCosmeticProductMutation(handlers: MutationHandlers = {}) {
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

      setListCosmeticProductsQueryData({
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
        setListCosmeticProductsQueryData({
          addCosmeticProduct: context.deletedItem,
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.deleteCosmeticProduct() });
    },
  });
}

export function useUpdateCosmeticProductMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateCosmeticProductResponse,
    DefaultError,
    { product: CosmeticProduct; newData: Omit<UpdateCosmeticProductRequest, 'id'> },
    {
      oldItem: CosmeticProduct;
      newItem: CosmeticProduct;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticProduct(),
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

      setListCosmeticProductsQueryData({
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
        setListCosmeticProductsQueryData({
          removeCosmeticProductById: context.newItem.id,
          addCosmeticProduct: context.oldItem,
        });
      }
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
  return useQuery<ListCosmeticProductsResponse, Error, ListCosmeticProductsResponse>({
    queryKey: StoreKeys.listCosmeticProducts(),
    queryFn: wrapApiAction(Schema.cosmetic.listCosmeticProducts),
    select: data => {
      return orderBy(data, item => item.name, 'asc');
    },
  });
}

function setListCosmeticProductsQueryData(arg: {
  addCosmeticProduct?: CosmeticProduct;
  removeCosmeticProductById?: string;
}) {
  if (arg.removeCosmeticProductById) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticProduct(arg.removeCosmeticProductById),
    });
  }

  if (arg.addCosmeticProduct) {
    queryClient.setQueryData(
      StoreKeys.getCosmeticProduct(arg.addCosmeticProduct.id),
      arg.addCosmeticProduct,
    );
  }
  // FIXME set data for get request

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
