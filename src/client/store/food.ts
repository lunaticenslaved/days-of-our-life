import { wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import { useQuery } from '@tanstack/react-query';

export function useListFoodProductsQuery() {
  return useQuery({
    queryKey: ['FoodSchema.products.list'],
    queryFn: wrapApiAction(Schema.food.products.list),
  });
}

export function useListFoodRecipesQuery() {
  return useQuery({
    queryKey: ['FoodSchema.recipes.list'],
    queryFn: wrapApiAction(Schema.food.recipes.list),
  });
}
