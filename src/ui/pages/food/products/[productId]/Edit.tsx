import { useFoodProductQuery, useUpdateProductMutation } from '#ui/api/food/products';
import { FoodProductForm } from '#ui/entities/food-product';
import { useFoodNavigation, useFoodPageParams } from '#ui/pages/food';

export default function Page() {
  const { productId = '' } = useFoodPageParams();
  const query = useFoodProductQuery(productId);
  const navigation = useFoodNavigation();
  const updating = useUpdateProductMutation(productId, {
    onSuccess: () => navigation.toProductOverview({ productId }),
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    throw new Error('Unknown product');
  }

  const product = query.data;

  return <FoodProductForm product={product} onSubmit={updating.mutate} />;
}
