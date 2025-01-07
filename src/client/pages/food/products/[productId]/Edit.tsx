import { divideNutrients } from '#/shared/models/food';
import { FoodProductForm } from '#/client/entities/food';
import { useFoodNavigation, useFoodPageParams } from '#/client/pages/food';
import { useGetFoodProductQuery, useUpdateFoodProductMutation } from '#/client/store';

export default function Page() {
  const { productId = '' } = useFoodPageParams();
  const query = useGetFoodProductQuery({ id: productId });
  const navigation = useFoodNavigation();
  const updating = useUpdateFoodProductMutation({
    onMutate: () => navigation.toProductOverview({ productId }),
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
          id: productId,
          name: values.name,
          manufacturer: values.manufacturer,
          nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
        });
      }}
    />
  );
}
