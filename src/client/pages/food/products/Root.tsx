import {
  FoodProductCreatingAction,
  FoodProductFilters,
  FoodProductsTable,
  useFoodProductFilters,
} from '#/client/entities/food';
import { useListFoodProductsQuery } from '#/client/store';
import { Page as PageWidget } from '#/client/widgets/Page';

export default function Page() {
  const { data: products = [] } = useListFoodProductsQuery();

  const productsFilters = useFoodProductFilters();

  return (
    <PageWidget
      title="Продукты"
      actions={<FoodProductCreatingAction />}
      filters={
        <FoodProductFilters
          value={productsFilters.value}
          onValueUpdate={productsFilters.onValueUpdate}
        />
      }>
      <FoodProductsTable products={productsFilters.filter(products)} />
    </PageWidget>
  );
}
