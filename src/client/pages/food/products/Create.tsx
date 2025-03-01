import { FoodProductForm } from '#/client/entities/food';
import { useFoodNavigation } from '#/client/pages/food';

export default function Create() {
  const navigation = useFoodNavigation();

  return <FoodProductForm type="create" onOptimisticSuccess={navigation.toProducts} />;
}
