import { FoodProduct, FoodValidators } from '#shared/models/food';
import { FFNumberInput } from '#ui/components/forms/FFNumberInput';
import { FForm } from '#ui/components/forms/FForm';
import { FFTextInput } from '#ui/components/forms/FFTextInput';
import { z } from 'zod';

const schema = z.object({
  name: FoodValidators.name,
  manufacturer: FoodValidators.manufacturer,
  nutrients: FoodValidators.nutrients,
});

type FoodProductFormValues = z.infer<typeof schema>;

interface FoodProductFormProps {
  product?: FoodProduct;
  onSubmit(values: FoodProductFormValues): void;
}

function getInitialValues(product?: FoodProduct): FoodProductFormValues {
  const nutrientsInGrams = product?.nutrientsPerGram;

  return {
    name: product?.name || '',
    manufacturer: product?.manufacturer || undefined,
    nutrients: {
      calories: (nutrientsInGrams?.calories || 0) * 100,
      proteins: (nutrientsInGrams?.proteins || 0) * 100,
      fats: (nutrientsInGrams?.fats || 0) * 100,
      carbs: (nutrientsInGrams?.carbs || 0) * 100,
      fibers: (nutrientsInGrams?.fibers || 0) * 100,
    },
  };
}

export function FoodProductForm({ onSubmit, product }: FoodProductFormProps) {
  return (
    <FForm
      schema={schema}
      onSubmit={({ nutrients, ...other }) => {
        return onSubmit({
          ...other,
          nutrients: {
            calories: nutrients.calories / 100,
            proteins: nutrients.proteins / 100,
            fats: nutrients.fats / 100,
            carbs: nutrients.carbs / 100,
            fibers: nutrients.fibers / 100,
          },
        });
      }}
      initialValues={getInitialValues(product)}>
      {() => (
        <>
          <FFTextInput name="name" title="Имя" required />
          <FFTextInput name="manufacturer" title="Производитель" />
          <FFNumberInput name="nutrients.calories" title="Калории в 100Г" required />
          <FFNumberInput name="nutrients.proteins" title="Белки в 100Г" required />
          <FFNumberInput name="nutrients.fats" title="Жиры в 100Г" required />
          <FFNumberInput name="nutrients.carbs" title="Углеводы в 100Г" required />
          <FFNumberInput name="nutrients.fibers" title="Клетчатка в 100Г" required />
        </>
      )}
    </FForm>
  );
}
