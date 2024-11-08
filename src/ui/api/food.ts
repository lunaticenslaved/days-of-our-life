import { FoodSchema } from '#shared/api/schemas/food';
import { FoodProduct } from '#shared/models/FoodProduct';
import { FoodRecipe } from '#shared/models/FoodRecipe';
import { wrapApiAction } from '.';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';

// Products
export function useListFoodProductsQuery() {
  return useQuery({
    queryKey: ['FoodSchema.products.list'],
    queryFn: wrapApiAction(FoodSchema.products.list),
  });
}

export function useGetFoodProductQuery(productId: string) {
  return useQuery({
    queryKey: [`FoodSchema.products.get(${productId})`],
    queryFn: () => wrapApiAction(FoodSchema.products.get)({ id: productId }),
  });
}

export function useCreateFoodProductMutation(handlers: Handlers<FoodProduct> = {}) {
  return useMutation({
    mutationKey: [`FoodSchema.products.create`],
    mutationFn: wrapApiAction(FoodSchema.products.create, handlers),
  });
}

export function useUpdateFoodProductMutation(
  productId: string,
  handlers: Handlers<FoodProduct> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.products.update(${productId})`],
    mutationFn: wrapApiAction(FoodSchema.products.update, handlers, { id: productId }),
  });
}

export function useDeleteFoodProductMutation(
  productId: string,
  handlers: Handlers<unknown> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.products.delete(${productId})`],
    mutationFn: wrapApiAction(FoodSchema.products.delete, handlers, { id: productId }),
  });
}

// Recipes
export function useListFoodRecipesQuery() {
  return useQuery({
    queryKey: ['FoodSchema.recipes.list'],
    queryFn: wrapApiAction(FoodSchema.recipes.list),
  });
}

export function useGetFoodRecipeQuery(recipeId: string) {
  return useQuery({
    queryKey: [`FoodSchema.recipes.get(${recipeId})`],
    queryFn: () => wrapApiAction(FoodSchema.recipes.get)({ id: recipeId }),
  });
}

export function useCreateFoodRecipeMutation(handlers: Handlers<FoodRecipe> = {}) {
  return useMutation({
    mutationKey: [`FoodSchema.recipes.create`],
    mutationFn: wrapApiAction(FoodSchema.recipes.create, handlers),
  });
}

export function useUpdateFoodRecipeMutation(
  productId: string,
  handlers: Handlers<FoodRecipe> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.recipes.update(${productId})`],
    mutationFn: wrapApiAction(FoodSchema.recipes.update, handlers, { id: productId }),
  });
}

export function useDeleteFoodRecipeMutation(
  productId: string,
  handlers: Handlers<unknown> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.recipes.delete(${productId})`],
    mutationFn: wrapApiAction(FoodSchema.recipes.delete, handlers),
  });
}
