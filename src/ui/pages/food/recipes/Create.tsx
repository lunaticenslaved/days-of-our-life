import { useListFoodProductsQuery } from '#ui/entities/food-product';
import { FoodRecipeForm, useCreateFoodRecipeMutation } from '#ui/entities/food-recipe';
import { useFoodNavigation, useFoodPageParams } from '#ui/pages/food';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const navigation = useFoodNavigation();

  const productsQuery = useListFoodProductsQuery();
  const editing = useCreateFoodRecipeMutation({
    onSuccess: () => navigation.toRecipeOverview({ recipeId }),
  });

  if (productsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return <FoodRecipeForm products={productsQuery.data || []} onSubmit={editing.mutate} />;
}
