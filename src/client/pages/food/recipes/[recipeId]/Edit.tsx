import { FoodRecipeForm } from '#/client/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';
import { useGetFoodRecipeQuery, useUpdateFoodRecipeMutation } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function FoodRecipeUpdatingPage() {
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
    <Page>
      <Page.Header>
        <Page.Title>Создание рецепта</Page.Title>
      </Page.Header>

      <Page.Content>
        <FoodRecipeForm
          recipe={query.data}
          onSubmit={async values => {
            await editing.mutate({
              ...values,
              id: recipeId,
            });
          }}
        />
      </Page.Content>
    </Page>
  );
}
