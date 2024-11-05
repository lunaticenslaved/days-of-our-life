import { FoodRecipe } from '#shared/models/FoodRecipe';
import { ApiRequest } from '#shared/models/request';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useFoodRecipesQuery() {
  return useQuery({
    queryKey: ['GET /food/recipes'],
    queryFn: () =>
      fetch('/api/food/recipes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodRecipe[]>) => {
          if (data.type === 'error') {
            throw new Error(data.message);
          } else {
            return data.data;
          }
        }),
  });
}

export function useFoodRecipeQuery(recipeId: string) {
  return useQuery({
    queryKey: [`GET /food/recipes/${recipeId}`],
    queryFn: () =>
      fetch(`/api/food/recipes/${recipeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodRecipe>) => {
          if (data.type === 'error') {
            throw new Error(data.message);
          } else {
            return data.data;
          }
        }),
  });
}

export function useCreateFoodRecipeMutation(handlers: Handlers<FoodRecipe> = {}) {
  return useMutation({
    mutationFn: (data: { name: string }, localHandlers: Handlers<FoodRecipe> = {}) => {
      return fetch(`/api/food/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodRecipe>) => {
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

export function useUpdateFoodRecipeMutation(
  recipeId: string,
  handlers: Handlers<FoodRecipe> = {},
) {
  return useMutation({
    mutationFn: (data: { name: string }, localHandlers: Handlers<FoodRecipe> = {}) => {
      return fetch(`/api/food/recipes/${recipeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((data: ApiRequest<FoodRecipe>) => {
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
