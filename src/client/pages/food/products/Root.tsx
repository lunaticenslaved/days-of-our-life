import {
  FoodProductCreatingAction,
  FoodProductFilters,
  FoodProductsTable,
  useFoodProductFilters,
} from '#/client/entities/food/products';
import { FoodProductActions } from '#/client/entities/food/products';
import { Page } from '#/client/widgets/Page';

export default function FoodProductsPage() {
  const productsFilters = useFoodProductFilters();

  return (
    <Page>
      <Page.Header>
        <Page.Title>Продукты</Page.Title>
        <Page.Actions>
          <FoodProductCreatingAction />
        </Page.Actions>
      </Page.Header>

      <Page.Header>
        <FoodProductFilters
          value={productsFilters.value}
          onValueUpdate={productsFilters.onValueUpdate}
        />
      </Page.Header>

      <Page.Content>
        <FoodProductsTable
          renderActions={product => {
            return <FoodProductActions productId={product.id} onDeleted={() => null} />;
          }}
        />
      </Page.Content>
    </Page>
  );
}
