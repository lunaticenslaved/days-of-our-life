import {
  FoodProductCreatingAction,
  FoodProductFilters,
  FoodProductsTable,
  useFoodProductFilters,
  useFoodProductsTableContainer,
} from '#/client/entities/food/products';
import { Page } from '#/client/widgets/Page';

export default function FoodProductsPage() {
  const productsFilters = useFoodProductFilters();
  const tableContainer = useFoodProductsTableContainer({
    filter: productsFilters.filter,
    actions: {
      use: true,
      onDeleted: () => null,
    },
  });

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
        <FoodProductsTable {...tableContainer} />
      </Page.Content>
    </Page>
  );
}
