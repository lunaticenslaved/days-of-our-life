import { useFoodProductsQuery } from '#ui/api/food/products';
import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../index';
import { FoodProductsTable } from '#ui/entities/food-product';

export default function Page() {
  const { data: products = [] } = useFoodProductsQuery();

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
