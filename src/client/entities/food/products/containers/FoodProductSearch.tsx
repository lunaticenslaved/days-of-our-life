import {
  FoodProductSingleSelect,
  FoodProductSingleSelectProps,
} from '#/client/entities/food/products/components/Select';
import { useListFoodProductsQuery } from '#/client/store';

interface FoodProductSearchProps
  extends Pick<FoodProductSingleSelectProps, 'value' | 'onValueUpdate'> {}

export function FoodProductSearch(props: FoodProductSearchProps) {
  const productsQuery = useListFoodProductsQuery();

  return <FoodProductSingleSelect {...props} entities={productsQuery.data || []} />;
}
