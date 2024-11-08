import { useCreateFoodProductMutation } from '#ui/api/food';
import { FoodProductForm } from '#ui/entities/food-product';
import { useFoodNavigation } from '#ui/pages/food';

export default function Create() {
  const navigation = useFoodNavigation();
  const creation = useCreateFoodProductMutation({
    onSuccess: navigation.toProducts,
  });

  return (
    <FoodProductForm
      onSubmit={values => {
        creation.mutate({
          name: values.name,
          manufacturer: values.manufacturer,
          nutrients: values.nutrients,
        });
      }}
    />
  );
}
