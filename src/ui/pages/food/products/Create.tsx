import { useCreateProductMutation } from '#ui/api/food/products';
import { FoodProductForm } from '#ui/entities/food-product';
import { useFoodNavigation } from '#ui/pages/food';

export default function Create() {
  const navigation = useFoodNavigation();
  const creation = useCreateProductMutation({
    onSuccess: navigation.toProducts,
  });

  return <FoodProductForm onSubmit={creation.mutate} />;
}
