import { FoodSchema } from '#/shared/api/schemas/food';
import { FoodRecipe } from '#/shared/models/food';
import { wrapApiAction } from '#/client/utils/api';
import { Handlers } from '#/client/types';
import { useMutation, useQuery } from '@tanstack/react-query';

// Recipe
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
