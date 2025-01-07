import { FoodRecipeForm } from '#/client/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';
import { useGetFoodRecipeQuery, useUpdateFoodRecipeMutation } from '#/client/store';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const navigation = useFoodNavigation();

  const query = useGetFoodRecipeQuery(recipeId);

  const editing = useUpdateFoodRecipeMutation({
    onSuccess: () => navigation.toRecipeOverview({ recipeId }),
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    return <div>not found</div>;
  }

  return (
    <FoodRecipeForm
      recipe={query.data}
      onSubmit={async values => {
        await editing.mutate({
          ...values,
          id: recipeId,
        });
      }}
    />
  );
}
