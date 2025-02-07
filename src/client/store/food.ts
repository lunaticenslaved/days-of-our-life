import {
  CreateFoodMealItemRequest,
  CreateFoodMealItemResponse,
  CreateFoodProductRequest,
  CreateFoodProductResponse,
  CreateFoodRecipeRequest,
  CreateFoodRecipeResponse,
  DeleteFoodMealItemResponse,
  DeleteFoodProductRequest,
  DeleteFoodProductResponse,
  DeleteFoodRecipeRequest,
  DeleteFoodRecipeResponse,
  GetFoodProductRequest,
  GetFoodProductResponse,
  ListFoodMealItemsResponse,
  ListFoodProductsResponse,
  UpdateFoodMealItemRequest,
  UpdateFoodMealItemResponse,
  UpdateFoodProductRequest,
  UpdateFoodProductResponse,
  UpdateFoodRecipeRequest,
  UpdateFoodRecipeResponse,
} from '#/shared/api/types/food';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import {
  FoodMealItem,
  FoodNutrients,
  FoodProduct,
  FoodRecipe,
} from '#/shared/models/food';
import { cloneDeep, omit, orderBy } from 'lodash';
import { DateFormat } from '#/shared/models/date';

const StoreKeys = {
  // Product
  listProducts: (): QueryKey => ['food', 'products', 'list'],
  getProduct: (productId: string): QueryKey => ['food', 'product', productId],
  createProduct: (): QueryKey => ['food', 'products', 'create'],
  deleteProduct: (): QueryKey => ['food', 'products', 'delete'],
  updateProduct: (): QueryKey => ['food', 'products', 'update'],

  // Recipe
  listRecipes: (): QueryKey => ['food', 'recipes', 'list'],
  getRecipe: (recipeId: string): QueryKey => ['food', 'recipe', recipeId],
  createRecipe: (): QueryKey => ['food', 'recipes', 'create'],
  updateRecipe: (): QueryKey => ['food', 'recipes', 'update'],
  deleteRecipe: (): QueryKey => ['food', 'recipes', 'delete'],

  // Meal Item
  listMealItems: (date: DateFormat): QueryKey => ['food', 'meal-items', date, 'list'],
  getMealItem: (mealItemId: string): QueryKey => ['food', 'meal-items', mealItemId],
  createMealItem: (): QueryKey => ['food', 'meal-items', 'create'],
  updateMealItem: (): QueryKey => ['food', 'meal-items', 'update'],
  deleteMealItem: (): QueryKey => ['food', 'meal-items', 'delete'],
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
    queryFn: wrapApiAction(Schema.food.listFoodProducts),
    select: data => {
      return orderBy(data, product => product.name.toLocaleLowerCase(), 'asc');
    },
  });
}

export function useGetFoodProductQuery(data: GetFoodProductRequest) {
  return useQuery<GetFoodProductResponse, Error, GetFoodProductResponse>({
    queryKey: StoreKeys.getProduct(data.id),
    queryFn: () => wrapApiAction(Schema.food.getFoodProduct)(data),
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
    mutationFn: wrapApiAction(Schema.food.deleteFoodProduct),
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
// FIXME add relavidation and cache updates
export function useListFoodRecipesQuery() {
  return useQuery({
    queryKey: ['FoodSchema.recipes.list'],
    queryFn: wrapApiAction(Schema.food.listFoodRecipes),
  });
}

export function useGetFoodRecipeQuery(recipeId: string) {
  return useQuery({
    queryKey: StoreKeys.getRecipe(recipeId),
    queryFn: () => wrapApiAction(Schema.food.getFoodRecipe)({ id: recipeId }),
  });
}

export function useCreateFoodRecipeMutation(handlers: MutationHandlers<FoodRecipe> = {}) {
  return useMutation<CreateFoodRecipeResponse, Error, CreateFoodRecipeRequest>({
    mutationKey: StoreKeys.createRecipe(),
    mutationFn: wrapApiAction(Schema.food.createFoodRecipe),
    onMutate() {
      handlers.onMutate?.();
    },
    onError: (_error, _request, _context) => {
      handlers.onError?.();
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: StoreKeys.listRecipes(),
      });
    },
  });
}

export function useUpdateFoodRecipeMutation(handlers: MutationHandlers<FoodRecipe> = {}) {
  return useMutation<UpdateFoodRecipeResponse, Error, UpdateFoodRecipeRequest>({
    mutationKey: StoreKeys.updateRecipe(),
    mutationFn: wrapApiAction(Schema.food.updateFoodRecipe),
    onMutate() {
      handlers.onMutate?.();
    },
    onError: (_error, _request, _context) => {
      handlers.onError?.();
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: StoreKeys.listRecipes(),
      });
    },
  });
}

export function useDeleteFoodRecipeMutation(handlers: MutationHandlers<void> = {}) {
  return useMutation<DeleteFoodRecipeResponse, Error, DeleteFoodRecipeRequest>({
    mutationKey: StoreKeys.deleteRecipe(),
    mutationFn: wrapApiAction(Schema.food.deleteFoodRecipe),
    onMutate() {
      handlers.onMutate?.();
    },
    onError: (_error, _request, _context) => {
      handlers.onError?.();
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: StoreKeys.listRecipes(),
      });
    },
  });
}

//
//
//
// Food Meal Item
// FIXME add cache update
export function useListFoodMealItemQuery(date: DateFormat) {
  return useQuery({
    queryKey: StoreKeys.listMealItems(date),
    queryFn: () => wrapApiAction(Schema.food.listFoodMealItems)({ date }),
  });
}

export function useCreateFoodMealItem(handlers: MutationHandlers<FoodMealItem> = {}) {
  return useMutation<
    CreateFoodMealItemResponse,
    Error,
    CreateFoodMealItemRequest & { nutrients: FoodNutrients },
    {
      createdItem: FoodMealItem;
    }
  >({
    mutationKey: StoreKeys.createMealItem(),
    mutationFn: wrapApiAction(Schema.food.createFoodMealItem),
    onMutate(request) {
      const createdItem: FoodMealItem = {
        id: Date.now().toString(),
        date: request.date,
        dayPartId: request.dayPartId,
        quantity: request.quantity,
        nutrients: request.nutrients,
        food: request.food,
      };

      handlers.onMutate?.();

      updateFoodMealItemsQueries({ addFoodMealItem: createdItem });

      return { createdItem };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: context?.createdItem,
      });
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateFoodMealItemsQueries({
        removeFoodMealItem: context.createdItem,
        addFoodMealItem: response,
      });
    },
  });
}

export function useUpdateFoodMealItem(handlers: MutationHandlers<FoodMealItem> = {}) {
  return useMutation<
    UpdateFoodMealItemResponse,
    Error,
    {
      oldItem: FoodMealItem;
      newValues: Omit<UpdateFoodMealItemRequest, 'id'> & { nutrients: FoodNutrients };
    },
    {
      oldItem: FoodMealItem;
      newItem: FoodMealItem;
    }
  >({
    mutationKey: StoreKeys.updateMealItem(),
    mutationFn: data =>
      wrapApiAction(Schema.food.updateFoodMealItem)({
        id: data.oldItem.id,
        ...omit(data.newValues, 'nutrients'),
      }),
    onMutate(request) {
      const newItem: FoodMealItem = {
        ...request.oldItem,
        id: Date.now().toString(),
      };

      handlers.onMutate?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: request.oldItem,
        addFoodMealItem: newItem,
      });

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: context?.newItem,
        addFoodMealItem: context?.oldItem,
      });
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateFoodMealItemsQueries({
        removeFoodMealItem: context?.newItem,
        addFoodMealItem: response,
      });
    },
  });
}

export function useDeleteFoodMealItem(handlers: MutationHandlers<void> = {}) {
  return useMutation<
    DeleteFoodMealItemResponse,
    Error,
    FoodMealItem & { nutrients: FoodNutrients },
    {
      removedItem: FoodMealItem & { nutrients: FoodNutrients };
    }
  >({
    mutationKey: StoreKeys.deleteMealItem(),
    mutationFn: data => wrapApiAction(Schema.food.deleteFoodMealItem)({ id: data.id }),
    onMutate(request) {
      handlers.onMutate?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: request,
      });

      return {
        removedItem: request,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      updateFoodMealItemsQueries({
        addFoodMealItem: context?.removedItem,
      });
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);
    },
  });
}

function updateFoodMealItemsQueries(arg: {
  addFoodMealItem?: FoodMealItem;
  removeFoodMealItem?: Pick<FoodMealItem, 'id' | 'date'>;
}) {
  if (arg.removeFoodMealItem) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getMealItem(arg.removeFoodMealItem.id),
    });

    queryClient.setQueryData<ListFoodMealItemsResponse>(
      StoreKeys.listMealItems(arg.removeFoodMealItem.date),
      _old => {
        if (!_old) {
          return _old;
        }

        let old = [..._old];

        old = old.filter(item => item.id !== arg.removeFoodMealItem?.id);

        return old;
      },
    );
  }

  if (arg.addFoodMealItem) {
    queryClient.setQueryData(
      StoreKeys.getMealItem(arg.addFoodMealItem.id),
      arg.addFoodMealItem,
    );

    queryClient.setQueryData<ListFoodMealItemsResponse>(
      StoreKeys.listMealItems(arg.addFoodMealItem.date),
      _old => {
        if (!_old) {
          return _old;
        }

        const old = [..._old];

        if (arg.addFoodMealItem) {
          old.push(arg.addFoodMealItem);
        }

        return old;
      },
    );
  }
}
