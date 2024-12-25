import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../index';
import {
  FoodProductsTable,
  useDeleteFoodProductMutation,
  useListFoodProductsQuery,
} from '#/client/entities/food';

export default function Page() {
  const { data: products = [], refetch } = useListFoodProductsQuery();
  const deleting = useDeleteFoodProductMutation('', {
    onSuccess: refetch,
  });

  return (
    <div>
      <Link to={FOOD_NAVIGATION.toProductCreate()}>Создать продукт</Link>
      <FoodProductsTable
        products={products}
        onDelete={p => deleting.mutate({ id: p.id })}
        createHref={p => FOOD_NAVIGATION.toProductOverview({ productId: p.id })}
      />
    </div>
  );
}
