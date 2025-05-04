import { useListFoodProductsQuery } from '#/client/entities/food/products';

export function useFoodRecipeFormData() {
  const listQuery = useListFoodProductsQuery();

  return {
    isLoading: listQuery.isLoading,
  };
}
