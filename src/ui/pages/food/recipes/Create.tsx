import { useFoodProductsQuery } from '#ui/api/food/products';
import { FoodRecipeForm } from '#ui/entities/food-recipe';
import { useFoodNavigation, useFoodPageParams } from '#ui/pages/food';
import { useCreateFoodRecipeMutation } from '#ui/api/food/recipes';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const navigation = useFoodNavigation();

  const productsQuery = useFoodProductsQuery();
  const editing = useCreateFoodRecipeMutation({
    onSuccess: () => navigation.toRecipeOverview({ recipeId }),
  });

  if (productsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return <FoodRecipeForm products={productsQuery.data || []} onSubmit={editing.mutate} />;
}
