import { FOOD_NAVIGATION } from '../index';
import {
  FoodProductCreatingAction,
  FoodProductFilters,
  FoodProductsTable,
  useFoodProductFilters,
} from '#/client/entities/food';
import { useDeleteFoodProductMutation, useListFoodProductsQuery } from '#/client/store';
import { Page as PageWidget } from '#/client/widgets/Page';
import { Flex } from '#/ui-lib/atoms/Flex';

export default function Page() {
  const { data: products = [] } = useListFoodProductsQuery();
  const deleting = useDeleteFoodProductMutation();

  const productsFilters = useFoodProductFilters();

  return (
    <PageWidget title="Продукты" actions={<FoodProductCreatingAction />}>
      <Flex direction="column" gap={2}>
        <FoodProductFilters
          value={productsFilters.value}
          onValueUpdate={productsFilters.onValueUpdate}
        />
        <FoodProductsTable
          products={productsFilters.filter(products)}
          onDelete={p => deleting.mutate({ id: p.id })}
          createHref={p => FOOD_NAVIGATION.toProductOverview({ productId: p.id })}
        />
      </Flex>
    </PageWidget>
  );
}
