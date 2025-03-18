import { CosmeticRecipeForm } from '#/client/entities/cosmetic/recipes';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import {
  useCreateCosmeticRecipeMutation,
  useListCosmeticIngredientsQuery,
} from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticRecipeCreatePage() {
  const listCosmeticIngredientsQuery = useListCosmeticIngredientsQuery();

  const cosmeticNavigation = useCosmeticNavigation();
  const createMutation = useCreateCosmeticRecipeMutation({
    onSuccess: recipe => {
      cosmeticNavigation.toRecipeOverview({ recipeId: recipe.id });
    },
  });

  return (
    <Page title="Создать рецепт">
      <CosmeticRecipeForm
        ingredients={listCosmeticIngredientsQuery.data || []}
        onSubmit={async values => {
          await createMutation.mutate({
            ...values,
            description: values.description || null,
          });
        }}
      />
    </Page>
  );
}
