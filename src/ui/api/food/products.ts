import { FoodProduct } from '#shared/models/FoodProduct';
import { ApiRequest } from '#shared/models/request';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useFoodProductsQuery() {
  return useQuery({
    queryKey: ['GET /food/products'],
    queryFn: () =>
      fetch('/api/food/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodProduct[]>) => {
          if (data.type === 'error') {
            throw new Error(data.message);
          } else {
            return data.data;
          }
        }),
  });
}

export function useFoodProductQuery(productId: string) {
  return useQuery({
    queryKey: [`GET /food/products/${productId}`],
    queryFn: () =>
      fetch(`/api/food/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodProduct>) => {
          if (data.type === 'error') {
            throw new Error(data.message);
          } else {
            return data.data;
          }
        }),
  });
}

export function useCreateProductMutation(handlers: Handlers<FoodProduct> = {}) {
  return useMutation({
    mutationFn: (data: { name: string }, localHandlers: Handlers<FoodProduct> = {}) => {
      return fetch('/api/food/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodProduct>) => {
          if (data.type === 'error') {
            const error = new Error(data.message);

            handlers.onError?.(error);
            localHandlers.onError?.(error);

            throw error;
          } else {
            handlers.onSuccess?.(data.data);
            localHandlers.onSuccess?.(data.data);

            return data.data;
          }
        });
    },
  });
}

export function useUpdateProductMutation(
  productId: string,
  handlers: Handlers<FoodProduct> = {},
) {
  return useMutation({
    mutationFn: (data: { name: string }, localHandlers: Handlers<FoodProduct> = {}) => {
      return fetch(`/api/food/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodProduct>) => {
          if (data.type === 'error') {
            const error = new Error(data.message);

            handlers.onError?.(error);
            localHandlers.onError?.(error);

            throw error;
          } else {
            handlers.onSuccess?.(data.data);
            localHandlers.onSuccess?.(data.data);

            return data.data;
          }
        });
    },
  });
}

export function useDeleteProductMutation(
  productId: string,
  handlers: Handlers<void> = {},
) {
  return useMutation({
    mutationFn: (data: { name: string }, localHandlers: Handlers<void> = {}) => {
      return fetch(`/api/food/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((data: ApiRequest<void>) => {
          if (data.type === 'error') {
            const error = new Error(data.message);

            handlers.onError?.(error);
            localHandlers.onError?.(error);

            throw error;
          } else {
            handlers.onSuccess?.(data.data);
            localHandlers.onSuccess?.(data.data);

            return data.data;
          }
        });
    },
  });
}
