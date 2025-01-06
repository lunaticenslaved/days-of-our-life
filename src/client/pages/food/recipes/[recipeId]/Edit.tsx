import {
  FoodRecipeForm,
  useGetFoodRecipeQuery,
  useUpdateFoodRecipeMutation,
} from '#/client/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const navigation = useFoodNavigation();

  const query = useGetFoodRecipeQuery(recipeId);

  const editing = useUpdateFoodRecipeMutation(recipeId, {
    onSuccess: () => navigation.toRecipeOverview({ recipeId }),
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    return <div>not found</div>;
  }

  return <FoodRecipeForm recipe={query.data} onSubmit={editing.mutate} />;
}
