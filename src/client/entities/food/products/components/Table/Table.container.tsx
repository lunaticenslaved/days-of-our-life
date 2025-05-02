import { ComponentProps, useMemo } from 'react';
import { TableComponent } from './Table.component';

import { FOOD_NAVIGATION } from '#/client/pages/food';
import { useFoodCacheStrict } from '#/client/entities/food/cache';
import { useListFoodProductsQuery } from '#/client/entities/food/products/store';
import { orderFoodProducts } from '#/client/entities/food/products/utils';

type FoodProductsTableProps = Omit<
  ComponentProps<typeof TableComponent>,
  'createHref' | 'products'
>;

export function TableContainer(props: FoodProductsTableProps) {
  const cache = useFoodCacheStrict();

  useListFoodProductsQuery();

  const products = useMemo(() => {
    return orderFoodProducts(cache.products.list());
  }, [cache.products]);

  return (
    <TableComponent
      {...props}
      products={products}
      createHref={product => {
        return FOOD_NAVIGATION.toProductOverview({ productId: product.id });
      }}
    />
  );
}
