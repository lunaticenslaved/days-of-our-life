import { FOOD_NAVIGATION } from '../index';
import { FoodProductCreatingAction, FoodProductsTable } from '#/client/entities/food';
import { useDeleteFoodProductMutation, useListFoodProductsQuery } from '#/client/store';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';

export default function Page() {
  const { data: products = [] } = useListFoodProductsQuery();
  const deleting = useDeleteFoodProductMutation();

  return (
    <div>
      <Flex direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Text variant="header-m">Продукты</Text>
        <FoodProductCreatingAction />
      </Flex>

      <FoodProductsTable
        products={products}
        onDelete={p => deleting.mutate({ id: p.id })}
        createHref={p => FOOD_NAVIGATION.toProductOverview({ productId: p.id })}
      />
    </div>
  );
}
