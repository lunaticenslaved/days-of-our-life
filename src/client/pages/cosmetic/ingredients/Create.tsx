import { CosmeticIngredientForm } from '#/client/entities/cosmetic/ingredients';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useCreateCosmeticIngredientMutation } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticIngredientCreatePage() {
  const cosmeticNavigation = useCosmeticNavigation();

  const creatingMutation = useCreateCosmeticIngredientMutation({
    onSuccess: ingredient => {
      cosmeticNavigation.toIngredientOverview({
        ingredientId: ingredient.id,
      });
    },
  });

  return (
    <Page>
      <Page.Header>
        <Page.Title>Создать ингредиент</Page.Title>
      </Page.Header>

      <Page.Content>
        <CosmeticIngredientForm
          onSubmit={values => {
            creatingMutation.mutate(values);
          }}
        />
      </Page.Content>
    </Page>
  );
}
