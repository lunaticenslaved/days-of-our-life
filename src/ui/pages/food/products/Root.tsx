import { useListFoodProductsQuery } from '#ui/api/food';
import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../index';
import { FoodProductsTable } from '#ui/entities/food-product';

export default function Page() {
  const { data: products = [] } = useListFoodProductsQuery();

  return (
    <div>
      <Link to={FOOD_NAVIGATION.toProductCreate()}>Создать продукт</Link>
      <FoodProductsTable
        products={products}
        createHref={p => FOOD_NAVIGATION.toProductOverview({ productId: p.id })}
      />
    </div>
  );
}
