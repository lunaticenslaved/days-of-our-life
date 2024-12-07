import { divideNutrients } from '#shared/models/food';
import { Button } from '#ui/components/Button';
import { FoodProductForm, useCreateFoodProductMutation } from '#ui/entities/food';
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
              nutrientsPerGram: product.nutrientsPerGram,
            });
          }
        }}>
        Fill basic
      </Button>
      <FoodProductForm
        onSubmit={async values => {
          await creation.mutate({
            name: values.name,
            manufacturer: values.manufacturer,
            nutrientsPerGram: divideNutrients(values.nutrients, 100),
          });
        }}
      />
    </>
  );
}
