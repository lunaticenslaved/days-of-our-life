import {
  FoodRecipeForm,
  useCreateFoodRecipeMutation,
  useFoodRecipeFormData,
} from '#/client/entities/food/recipes';
import { useFoodNavigation } from '#/client/pages/food';
import { Page } from '#/client/widgets/Page';

export default function FoodRecipeCreatingPage() {
  const navigation = useFoodNavigation();

  const creating = useCreateFoodRecipeMutation({
    onSuccess: recipe => navigation.toRecipeOverview({ recipeId: recipe.id }),
  });

  const formData = useFoodRecipeFormData();

  if (formData.isLoading) {
    return 'Loading...';
  }

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
