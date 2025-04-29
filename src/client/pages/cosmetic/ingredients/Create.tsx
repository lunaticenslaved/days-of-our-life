import {
  CosmeticIngredientForm,
  useCreateCosmeticIngredientMutation,
} from '#/client/entities/cosmetic/ingredients';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
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
          type="create"
          onSuccess={values => {
            creatingMutation.mutate(values);
          }}
        />
      </Page.Content>
    </Page>
  );
}
