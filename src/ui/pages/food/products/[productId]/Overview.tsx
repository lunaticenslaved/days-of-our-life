import { useGetFoodProductQuery } from '#ui/api/food';
import { FOOD_NAVIGATION, useFoodPageParams } from '#ui/pages/food';
import { Link } from 'react-router-dom';

export default function Page() {
  const { productId = '' } = useFoodPageParams();
  const query = useGetFoodProductQuery(productId);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    throw new Error('Unknown product');
  }

  const product = query.data;
  const { nutrientsPerGram } = product;

  return (
    <section>
      <Link to={FOOD_NAVIGATION.toProductEdit({ productId: product.id })}>
        Редактировать
      </Link>

      <h1>{product.name}</h1>
      {product.manufacturer && <h2>{product.manufacturer}</h2>}

      <ul>
        <li>Калории - {nutrientsPerGram.calories * 100}</li>
        <li>Белки - {nutrientsPerGram.proteins * 100}</li>
        <li>Жиры - {nutrientsPerGram.fats * 100}</li>
        <li>Углеводы - {nutrientsPerGram.carbs * 100}</li>
        <li>Клетчатка - {nutrientsPerGram.fibers * 100}</li>
      </ul>
    </section>
  );
}
