import { CosmeticRecipeForm } from '#/client/entities/cosmetic';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import {
  useCreateCosmeticRecipeMutation,
  useListCosmeticIngredientsQuery,
} from '#/client/store';

export default function Page() {
  const listCosmeticIngredientsQuery = useListCosmeticIngredientsQuery();

  const cosmeticNavigation = useCosmeticNavigation();
  const createMutation = useCreateCosmeticRecipeMutation({
    onSuccess: recipe => {
      cosmeticNavigation.toRecipeOverview({ recipeId: recipe.id });
    },
  });

  return (
    <div>
      <h1>Создать рецепт</h1>

      <CosmeticRecipeForm
        ingredients={listCosmeticIngredientsQuery.data || []}
        onSubmit={async values => {
          await createMutation.mutate({
            ...values,
            description: values.description || null,
          });
        }}
      />
    </div>
  );
}
