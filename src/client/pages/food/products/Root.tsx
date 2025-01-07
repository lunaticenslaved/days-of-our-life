import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../index';
import { FoodProductsTable } from '#/client/entities/food';
import { useDeleteFoodProductMutation, useListFoodProductsQuery } from '#/client/store';

export default function Page() {
  const { data: products = [] } = useListFoodProductsQuery();
  const deleting = useDeleteFoodProductMutation();

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
