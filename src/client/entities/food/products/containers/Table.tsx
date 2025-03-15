import { ComponentProps } from 'react';
import { FoodProductsTable as BaseTable } from '../components/Table';

import { FoodProductActions } from './Actions';
import { FOOD_NAVIGATION } from '#/client/pages/food';

type FoodProductsTableProps = Omit<
  ComponentProps<typeof BaseTable>,
  'renderActions' | 'createHref'
>;

export function FoodProductsTable(props: FoodProductsTableProps) {
  return (
    <BaseTable
      {...props}
      createHref={product => {
        return FOOD_NAVIGATION.toProductOverview({ productId: product.id });
      }}
      renderActions={product => {
        return <FoodProductActions entity={product} />;
      }}
    />
  );
}
