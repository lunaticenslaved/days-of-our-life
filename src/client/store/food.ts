import {
  CreateFoodProductRequest,
  CreateFoodProductResponse,
  DeleteFoodProductRequest,
  DeleteFoodProductResponse,
  GetFoodProductRequest,
  GetFoodProductResponse,
  ListFoodProductsResponse,
  UpdateFoodProductRequest,
  UpdateFoodProductResponse,
} from '#/shared/api/types/food';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { FoodProduct } from '#/shared/models/food';
import { cloneDeep, orderBy } from 'lodash';

const StoreKeys = {
  listProducts: (): QueryKey => ['food', 'products', 'list'],
  getProduct: (productId: string): QueryKey => ['food', 'product', productId],
  createProduct: (): QueryKey => ['food', 'products', 'create'],
  deleteProduct: (): QueryKey => ['food', 'products', 'delete'],
  updateProduct: (): QueryKey => ['food', 'products', 'update'],
};

async function onProductsChange(arg: {
  addProduct?: FoodProduct;
  removeProductId?: string;
}) {
  await queryClient.cancelQueries({ queryKey: StoreKeys.listProducts() });

  queryClient.setQueryData<ListFoodProductsResponse>(StoreKeys.listProducts(), _old => {
    if (!_old) {
      return _old;
    }

    let result = cloneDeep(_old);

    if (arg.removeProductId) {
      result = result.filter(product => product.id !== arg.removeProductId);
    }

    if (arg.addProduct) {
      result.push(arg.addProduct);
    }

    return result;
  });

  if (arg.removeProductId) {
    await queryClient.cancelQueries({
      queryKey: StoreKeys.getProduct(arg.removeProductId),
    });

    queryClient.setQueryData<GetFoodProductResponse>(
      StoreKeys.getProduct(arg.removeProductId),
      () => {
        return undefined;
      },
    );
  }

  if (arg.addProduct) {
    await queryClient.cancelQueries({
      queryKey: StoreKeys.getProduct(arg.addProduct.id),
    });

    queryClient.setQueryData<GetFoodProductResponse>(
      StoreKeys.getProduct(arg.addProduct.id),
      () => {
        return arg.addProduct;
      },
    );
  }
}

// Product
export function useListFoodProductsQuery() {
  return useQuery<ListFoodProductsResponse, Error, ListFoodProductsResponse>({
    queryKey: StoreKeys.listProducts(),
    queryFn: wrapApiAction(Schema.food.products.list),
    select: data => {
      return orderBy(data, product => product.name.toLocaleLowerCase(), 'asc');
    },
  });
}

export function useGetFoodProductQuery(data: GetFoodProductRequest) {
  return useQuery<GetFoodProductResponse, Error, GetFoodProductResponse>({
    queryKey: StoreKeys.getProduct(data.id),
    queryFn: () => wrapApiAction(Schema.food.products.get)(data),
  });
}

export function useCreateFoodProductMutation(
  handlers: MutationHandlers<FoodProduct> = {},
) {
  return useMutation<
    CreateFoodProductResponse,
    Error,
    CreateFoodProductRequest,
    {
      createdProduct: FoodProduct;
    }
  >({
    mutationKey: StoreKeys.createProduct(),
    mutationFn: wrapApiAction(Schema.food.products.create, handlers),
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

      await onProductsChange({
        addProduct: createdProduct,
      });

      handlers.onMutate?.();

      return { createdProduct };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        onProductsChange({
          removeProductId: context.createdProduct.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      onProductsChange({
        addProduct: response,
        removeProductId: context.createdProduct.id,
      });
    },
  });
}
export function useUpdateFoodProductMutation(
  handlers: MutationHandlers<FoodProduct> = {},
) {
  return useMutation<
    UpdateFoodProductResponse,
    Error,
    UpdateFoodProductRequest,
    {
      oldProduct?: FoodProduct;
      createdProduct: FoodProduct;
    }
  >({
    mutationKey: StoreKeys.updateProduct(),
    mutationFn: wrapApiAction(Schema.food.products.update),
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
        StoreKeys.listProducts(),
      );

      const oldProduct = products?.find(product => product.id === variables.id);

      await onProductsChange({
        removeProductId: oldProduct?.id,
        addProduct: createdProduct,
      });

      handlers.onMutate?.();

      return { createdProduct, oldProduct };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        onProductsChange({
          removeProductId: context.createdProduct.id,
          addProduct: context.createdProduct,
        });
      }
    },
    onSuccess: (response, _request, _context) => {
      onProductsChange({
        removeProductId: response.id,
        addProduct: response,
      });

      handlers.onSuccess?.(response);
    },
  });
}

export function useDeleteFoodProductMutation(
  handlers: MutationHandlers<DeleteFoodProductRequest> = {},
) {
  return useMutation<
    DeleteFoodProductResponse,
    Error,
    DeleteFoodProductRequest,
    {
      deletedProduct?: FoodProduct;
    }
  >({
    mutationKey: StoreKeys.deleteProduct(),
    mutationFn: wrapApiAction(Schema.food.products.delete),
    async onMutate(variables) {
      const products = queryClient.getQueryData<ListFoodProductsResponse>(
        StoreKeys.listProducts(),
      );

      const deletedProduct = products?.find(product => product.id === variables.id);

      await onProductsChange({
        removeProductId: variables.id,
      });

      return { deletedProduct };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        onProductsChange({
          addProduct: context.deletedProduct,
        });
      }
    },
    onSuccess: (_response, request, _context) => {
      handlers.onSuccess?.(request);
    },
  });
}

// Recipe
export function useListFoodRecipesQuery() {
  return useQuery({
    queryKey: ['FoodSchema.recipes.list'],
    queryFn: wrapApiAction(Schema.food.recipes.list),
  });
}
