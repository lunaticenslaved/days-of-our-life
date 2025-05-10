import { useCosmeticCacheStrict } from '#/client/entities/cosmetic';
import { useGetCosmeticIngredientQuery } from '#/client/entities/cosmetic/ingredients';
import { useCosmeticPageParams } from '#/client/pages/cosmetic';
import { Page } from '#/client/widgets/Page';
import { Flex, Text } from '#/ui-lib/components';

export default function CosmeticIngredientOverviewPage() {
  const { ingredientId = '' } = useCosmeticPageParams();

  const query = useGetCosmeticIngredientQuery(ingredientId);
  const cache = useCosmeticCacheStrict();

  if (query.error) {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Ингредиент</Page.Title>
        </Page.Header>

        <Page.Content>
          <Page.Error></Page.Error>
        </Page.Content>
      </Page>
    );
  }

  const ingredient = cache.ingredients.find(ingredientId);

  if (!ingredient) {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Ингредиент</Page.Title>
        </Page.Header>

        <Page.Content>
          <Page.Loading></Page.Loading>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header>
        <Page.Title>{ingredient.name}</Page.Title>
      </Page.Header>

      <Page.Content>
        <Flex>
          <Text>Преимущества</Text>
        </Flex>
      </Page.Content>
    </Page>
  );
}
