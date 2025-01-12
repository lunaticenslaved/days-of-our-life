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
  CreateCosmeticIngredientRequest,
  CreateCosmeticIngredientResponse,
  CreateCosmeticProductRequest,
  CreateCosmeticProductResponse,
  DeleteCosmeticBenefitRequest,
  DeleteCosmeticBenefitResponse,
  DeleteCosmeticIngredientRequest,
  DeleteCosmeticIngredientResponse,
  DeleteCosmeticProductRequest,
  DeleteCosmeticProductResponse,
  GetCosmeticBenefitResponse,
  GetCosmeticIngredientResponse,
  GetCosmeticProductResponse,
  ListCosmeticBenefitsResponse,
  ListCosmeticIngredientsResponse,
  ListCosmeticProductsResponse,
  UpdateCosmeticBenefitRequest,
  UpdateCosmeticBenefitResponse,
  UpdateCosmeticIngredientRequest,
  UpdateCosmeticIngredientResponse,
  UpdateCosmeticProductRequest,
  UpdateCosmeticProductResponse,
} from '#/shared/api/types/cosmetic';
import {
  CosmeticIngredient,
  CosmeticBenefit,
  CosmeticProduct,
} from '#/shared/models/cosmetic';
import { orderBy } from 'lodash';

const StoreKeys = {
  // Cosmetic Products
  getCosmeticProduct: (productId: string): QueryKey => [
    'cosmetic',
    'products',
    productId,
  ],
  listCosmeticProducts: (): QueryKey => ['cosmetic', 'products'],
  createCosmeticProduct: (): MutationKey => ['cosmetic', 'products', 'create'],
  deleteCosmeticProduct: (): MutationKey => ['cosmetic', 'products', 'delete'],
  updateCosmeticProduct: (): MutationKey => ['cosmetic', 'products', 'update'],

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
};

// Cosmetic Products
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
      )({ id: data.ingredient.id, ...data.newData }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticIngredients() });

      const newItem: CosmeticIngredient = {
        id: request.ingredient.id,
        ...request.newData,
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
      return orderBy(data, item => item.name, 'asc');
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

export function useListCosmeticBenefitsQuery() {
  return useQuery<ListCosmeticBenefitsResponse, Error, ListCosmeticBenefitsResponse>({
    queryKey: StoreKeys.listCosmeticBenefits(),
    queryFn: wrapApiAction(Schema.cosmetic.listCosmeticBenefits),
    select: data => {
      return orderBy(data, item => item.name, 'asc');
    },
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
