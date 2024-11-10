import { useCreateFoodProductMutation } from '#ui/api/food';
import { Button } from '#ui/components/Button';
import { FoodProductForm } from '#ui/entities/food-product';
import { useFoodNavigation } from '#ui/pages/food';

import products from './products.json';

export default function Create() {
  const navigation = useFoodNavigation();
  const creation = useCreateFoodProductMutation({
    onSuccess: navigation.toProducts,
  });
  const creationRaw = useCreateFoodProductMutation({});

  return (
    <>
      <Button
        onClick={async () => {
          if (![].length) {
            return;
          }

          for (const product of products) {
            await creationRaw.mutate({
              name: product.name,
              nutrientsPerGram: {
                calories: product.nutrients.calories / 100,
                proteins: product.nutrients.proteins / 100,
                fats: product.nutrients.fats / 100,
                carbs: product.nutrients.carbs / 100,
                fibers: product.nutrients.fibers / 100,
              },
            });
          }
        }}>
        Fill basic
      </Button>
      <FoodProductForm
        onSubmit={values => {
          creation.mutate({
            name: values.name,
            manufacturer: values.manufacturer,
            nutrientsPerGram: {
              calories: values.nutrients.calories / 100,
              proteins: values.nutrients.proteins / 100,
              fats: values.nutrients.fats / 100,
              carbs: values.nutrients.carbs / 100,
              fibers: values.nutrients.fibers / 100,
            },
          });
        }}
      />
    </>
  );
}
