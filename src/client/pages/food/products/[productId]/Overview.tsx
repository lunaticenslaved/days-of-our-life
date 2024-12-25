import { multiplyNutrients } from '#/shared/models/food';
import { useGetFoodProductQuery, FoodNutrientsList } from '#/client/entities/food';
import { FOOD_NAVIGATION, useFoodPageParams } from '#/client/pages/food';
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
  const nutrients = multiplyNutrients(product.nutrientsPerGram, 100);

  return (
    <section>
      <Link to={FOOD_NAVIGATION.toProductEdit({ productId: product.id })}>
        Редактировать
      </Link>

      <h1>{product.name}</h1>
      {product.manufacturer && <h2>{product.manufacturer}</h2>}

      <FoodNutrientsList nutrients={nutrients} />
    </section>
  );
}
