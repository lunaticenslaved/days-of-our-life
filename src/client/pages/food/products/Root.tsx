import {
  FoodProductCreatingAction,
  FoodProductFilters,
  FoodProductsTable,
  useFoodProductFilters,
} from '#/client/entities/food';
import { useListFoodProductsQuery } from '#/client/store';
import { Page } from '#/client/widgets/Page';

export default function FoodProductsPage() {
  const { data: products = [] } = useListFoodProductsQuery();

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
        <FoodProductsTable products={productsFilters.filter(products)} />
      </Page.Content>
    </Page>
  );
}
