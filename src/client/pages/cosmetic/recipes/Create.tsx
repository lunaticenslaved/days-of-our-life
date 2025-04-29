import { useListCosmeticIngredientsQuery } from '#/client/entities/cosmetic/ingredients';
import {
  CosmeticRecipeForm,
  useCreateCosmeticRecipeMutation,
} from '#/client/entities/cosmetic/recipes';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { Page } from '#/client/widgets/Page';

export default function CosmeticRecipeCreatePage() {
  useListCosmeticIngredientsQuery();

  const cosmeticNavigation = useCosmeticNavigation();
  const createMutation = useCreateCosmeticRecipeMutation({
    onSuccess: recipe => {
      cosmeticNavigation.toRecipeOverview({ recipeId: recipe.id });
    },
  });

  return (
    <Page>
      <Page.Header>
        <Page.Title>Создать рецепт</Page.Title>
      </Page.Header>

      <Page.Content>
        <CosmeticRecipeForm
          onSubmit={async values => {
            await createMutation.mutate({
              ...values,
              description: values.description || null,
            });
          }}
        />
      </Page.Content>
    </Page>
  );
}
