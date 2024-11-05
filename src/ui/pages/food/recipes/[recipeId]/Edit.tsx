import { useFoodProductsQuery } from '#ui/api/food/products';
import { useFoodRecipeQuery, useUpdateFoodRecipeMutation } from '#ui/api/food/recipes';
import { FoodRecipeForm } from '#ui/entities/food-recipe';
import { useFoodNavigation, useFoodPageParams } from '#ui/pages/food';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const navigation = useFoodNavigation();

  const query = useFoodRecipeQuery(recipeId);

  const productsQuery = useFoodProductsQuery();
  const editing = useUpdateFoodRecipeMutation(recipeId, {
    onSuccess: () => navigation.toRecipeOverview({ recipeId }),
  });

  if (query.isLoading || productsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    return <div>not found</div>;
  }

  return (
    <FoodRecipeForm
      recipe={query.data}
      products={productsQuery.data || []}
      onSubmit={editing.mutate}
    />
  );
}
