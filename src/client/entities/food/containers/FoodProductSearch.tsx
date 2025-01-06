import {
  FoodProductSelect,
  FoodProductSelectProps,
} from '#/client/entities/food/components/ProductSelect';
import { useListFoodProductsQuery } from '#/client/store';

interface FoodProductSearchProps extends Omit<FoodProductSelectProps, 'products'> {}

export function FoodProductSearch(props: FoodProductSearchProps) {
  const productsQuery = useListFoodProductsQuery();

  return <FoodProductSelect {...props} products={productsQuery.data || []} />;
}
