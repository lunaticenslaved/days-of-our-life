import { CosmeticRecipeForm } from '#/client/entities/cosmetic/recipes';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import {
  useGetCosmeticRecipeQuery,
  useListCosmeticIngredientsQuery,
  useUpdateCosmeticRecipeMutation,
} from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticRecipeEditPage() {
  const { recipeId = '' } = useCosmeticPageParams();

  const getCosmeticRecipeQuery = useGetCosmeticRecipeQuery(recipeId);
  const listCosmeticIngredientsQuery = useListCosmeticIngredientsQuery();

  const recipe = getCosmeticRecipeQuery.data;
  const cosmeticIngredients = listCosmeticIngredientsQuery.data;

  const cosmeticNavigation = useCosmeticNavigation();
  const updateMutation = useUpdateCosmeticRecipeMutation({
    onMutate: () => {
      if (recipe) {
        cosmeticNavigation.toRecipeOverview({ recipeId: recipe.id });
      }
    },
  });

  if (!recipe || !cosmeticIngredients) {
    return <div>Loading...</div>;
  }

  return (
    <Page title="Редактировать рецепт">
      <CosmeticRecipeForm
        recipe={recipe}
        ingredients={listCosmeticIngredientsQuery.data || []}
        onSubmit={async values => {
          await updateMutation.mutate({
            oldItem: recipe,
            newData: {
              ...values,
              description: values.description || null,
            },
          });
        }}
      />
    </Page>
  );
}
