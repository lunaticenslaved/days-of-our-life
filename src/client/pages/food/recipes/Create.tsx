import { FoodRecipeForm } from '#/client/entities/food';
import { useFoodNavigation } from '#/client/pages/food';
import { useCreateFoodRecipeMutation } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function FoodRecipeCreatingPage() {
  const navigation = useFoodNavigation();

  const creating = useCreateFoodRecipeMutation({
    onSuccess: recipe => navigation.toRecipeOverview({ recipeId: recipe.id }),
  });

  return (
    <Page>
      <Page.Header>
        <Page.Title>Создание рецепта</Page.Title>
      </Page.Header>

      <Page.Content>
        <FoodRecipeForm onSubmit={creating.mutate} />
      </Page.Content>
    </Page>
  );
}
