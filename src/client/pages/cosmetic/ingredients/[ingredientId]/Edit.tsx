import { CosmeticIngredientForm } from '#/client/entities/cosmetic/ingredients';
import { useCosmeticNavigation, useCosmeticPageParams } from '#/client/pages/cosmetic';
import {
  useGetCosmeticIngredientQuery,
  useUpdateCosmeticIngredientMutation,
} from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function CosmeticIngredientEditPage() {
  const { ingredientId = '' } = useCosmeticPageParams();

  const cosmeticNavigation = useCosmeticNavigation();

  const getQuery = useGetCosmeticIngredientQuery(ingredientId);

  const ingredient = getQuery.data;

  const updatingMutation = useUpdateCosmeticIngredientMutation({
    onMutate: () => {
      cosmeticNavigation.toIngredientOverview({ ingredientId });
    },
  });

  if (!ingredient) {
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
          ingredient={ingredient}
          onSubmit={values => {
            updatingMutation.mutate({
              newData: values,
              ingredient,
            });
          }}
        />
      </Page.Content>
    </Page>
  );
}
