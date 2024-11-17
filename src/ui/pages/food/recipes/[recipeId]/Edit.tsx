import {
  useListFoodProductsQuery,
  FoodRecipeForm,
  useGetFoodRecipeQuery,
  useUpdateFoodRecipeMutation,
} from '#ui/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#ui/pages/food';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const navigation = useFoodNavigation();

  const query = useGetFoodRecipeQuery(recipeId);

  const productsQuery = useListFoodProductsQuery();
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
