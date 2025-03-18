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
    <Page
      title="Продукты"
      actions={<FoodProductCreatingAction />}
      filters={
        <FoodProductFilters
          value={productsFilters.value}
          onValueUpdate={productsFilters.onValueUpdate}
        />
      }>
      <FoodProductsTable products={productsFilters.filter(products)} />
    </Page>
  );
}
