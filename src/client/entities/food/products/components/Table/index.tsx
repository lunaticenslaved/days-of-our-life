import { ComponentProps, useMemo } from 'react';
import { TableComponent } from './Table.component';
import { useFoodCacheStrict } from '#/client/entities/food';
import { FoodProduct } from '#/shared/models/food';
import { FOOD_NAVIGATION } from '#/client/pages/food';

import { useListFoodProductsQuery } from '../../queries';
import { orderFoodProducts } from '../../utils';
import { useFoodProductActionsContainer, FoodProductActions } from '../Actions';

type TableComponentProps = ComponentProps<typeof TableComponent>;

export { TableComponent as FoodProductsTable };

export function useFoodProductsTableContainer(arg: {
  actions?: {
    use: true;
    onDeleted: () => void;
  };
  filter?: (products: FoodProduct[]) => FoodProduct[];
}): Pick<TableComponentProps, 'products' | 'renderActions' | 'createHref'> {
  const cache = useFoodCacheStrict();

  useListFoodProductsQuery();

  const products = useMemo(() => {
    const ordered = orderFoodProducts(cache.products.list());

    if (arg.filter) {
      return arg.filter(ordered);
    }

    return ordered;
  }, [arg, cache.products]);

  const { actions } = arg;

  return {
    products,
    renderActions: actions
      ? (product: FoodProduct) => {
          return <Actions product={product} onDeleted={actions.onDeleted} />;
        }
      : undefined,
    createHref: (product: FoodProduct) => {
      return FOOD_NAVIGATION.toProductOverview({ productId: product.id });
    },
  };
}

function Actions(props: { product: FoodProduct; onDeleted: () => void }) {
  const actionsContainer = useFoodProductActionsContainer({
    productId: props.product.id,
    onDeleted: props.onDeleted,
  });

  return <FoodProductActions {...actionsContainer} entity={props.product} />;
}
