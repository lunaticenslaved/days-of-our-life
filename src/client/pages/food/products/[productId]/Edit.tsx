import { FoodProductForm } from '#/client/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';
import { useGetFoodProductQuery } from '#/client/store';

export default function Page() {
  const { productId = '' } = useFoodPageParams();
  const query = useGetFoodProductQuery({ id: productId });
  const navigation = useFoodNavigation();

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    throw new Error('Unknown product');
  }

  const product = query.data;

  return (
    <FoodProductForm
      type="update"
      product={product}
      onSuccess={({ id: productId }) => {
        navigation.toProductOverview({ productId });
      }}
    />
  );
}
