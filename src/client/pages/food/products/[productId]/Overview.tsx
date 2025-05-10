import { multiplyNutrients } from '#/shared/models/food';
import { FoodNutrientsList } from '#/client/entities/food';
import {
  FoodProductActions,
  useFoodProductActionsContainer,
} from '#/client/entities/food/products';
import { useGetFoodProductQuery } from '#/client/entities/food/products';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';
import { Page } from '#/client/widgets/Page';

export default function FoodProductOverviewPage() {
  const { productId = '' } = useFoodPageParams();
  const query = useGetFoodProductQuery(productId);

  const navigation = useFoodNavigation();

  const actionsContainer = useFoodProductActionsContainer({
    productId,
    onDeleted: () => {
      navigation.toProducts();
    },
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    throw new Error('Unknown product');
  }

  const product = query.data;
  const nutrients = multiplyNutrients(product.nutrientsPerGram, 100);

  return (
    <Page>
      <Page.Header>
        <Page.Title>{product.name}</Page.Title>
        <Page.Actions>
          <FoodProductActions {...actionsContainer} entity={query.data} />
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        {product.manufacturer && <h2>{product.manufacturer}</h2>}
        <FoodNutrientsList nutrients={nutrients} />
      </Page.Content>
    </Page>
  );
}
