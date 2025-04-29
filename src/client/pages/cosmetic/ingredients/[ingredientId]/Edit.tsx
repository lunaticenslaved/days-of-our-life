import {
  CosmeticIngredientForm,
  useGetCosmeticIngredientQuery,
} from '#/client/entities/cosmetic/ingredients';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import { Page } from '#/client/widgets/Page';

export default function CosmeticIngredientEditPage() {
  const { ingredientId = '' } = useCosmeticPageParams();

  const cosmeticNavigation = useCosmeticNavigation();

  const getQuery = useGetCosmeticIngredientQuery(ingredientId);

  if (!getQuery.data) {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Редактировать ингредиент</Page.Title>
        </Page.Header>

        <Page.Content>
          <Page.Loading />
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header>
        <Page.Title>Редактировать ингредиент</Page.Title>
      </Page.Header>

      <Page.Content>
        <CosmeticIngredientForm
          type="update"
          ingredientId={ingredientId}
          onOptimisticResponse={() => {
            cosmeticNavigation.toIngredientOverview({ ingredientId });
          }}
        />
      </Page.Content>
    </Page>
  );
}
