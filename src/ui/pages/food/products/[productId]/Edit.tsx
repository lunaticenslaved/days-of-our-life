import { useGetFoodProductQuery, useUpdateFoodProductMutation } from '#ui/api/food';
import { FoodProductForm } from '#ui/entities/food-product';
import { useFoodNavigation, useFoodPageParams } from '#ui/pages/food';

export default function Page() {
  const { productId = '' } = useFoodPageParams();
  const query = useGetFoodProductQuery(productId);
  const navigation = useFoodNavigation();
  const updating = useUpdateFoodProductMutation(productId, {
    onSuccess: () => navigation.toProductOverview({ productId }),
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    throw new Error('Unknown product');
  }

  const product = query.data;

  return (
    <FoodProductForm
      product={product}
      onSubmit={values => {
        updating.mutate({
          name: values.name,
          manufacturer: values.manufacturer,
          nutrientsPerGram: values.nutrients,
        });
      }}
    />
  );
}
