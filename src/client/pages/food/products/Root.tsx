import { FOOD_NAVIGATION } from '../index';
import { FoodProductCreatingAction, FoodProductsTable } from '#/client/entities/food';
import { useDeleteFoodProductMutation, useListFoodProductsQuery } from '#/client/store';
import { Page as PageWidget } from '#/client/widgets/Page';

export default function Page() {
  const { data: products = [] } = useListFoodProductsQuery();
  const deleting = useDeleteFoodProductMutation();

  return (
    <PageWidget title="Продукты" actions={<FoodProductCreatingAction />}>
      <FoodProductsTable
        products={products}
        onDelete={p => deleting.mutate({ id: p.id })}
        createHref={p => FOOD_NAVIGATION.toProductOverview({ productId: p.id })}
      />
    </PageWidget>
  );
}
