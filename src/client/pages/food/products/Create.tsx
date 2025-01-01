import { divideNutrients } from '#/shared/models/food';
import { Button } from '#/client/components/Button';
import { FoodProductForm, useCreateFoodProductMutation } from '#/client/entities/food';
import { useFoodNavigation } from '#/client/pages/food';

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
            nutrientsPerGram: divideNutrients(values.nutrientsPer100Gramm, 100),
          });
        }}
      />
    </>
  );
}
