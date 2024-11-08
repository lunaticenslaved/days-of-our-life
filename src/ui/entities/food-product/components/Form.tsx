import { FoodProduct, FoodProductFieldValidators } from '#shared/models/FoodProduct';
import { FFNumberInput } from '#ui/components/forms/FFNumberInput';
import { FForm } from '#ui/components/forms/FForm';
import { FFTextInput } from '#ui/components/forms/FFTextInput';
import { z } from 'zod';

const schema = z.object({
  name: FoodProductFieldValidators.name,
  manufacturer: FoodProductFieldValidators.manufacturer,
  nutrients: z.object({
    calories: FoodProductFieldValidators.calories,
    proteins: FoodProductFieldValidators.proteins,
    fats: FoodProductFieldValidators.fats,
    carbs: FoodProductFieldValidators.carbs,
    fibers: FoodProductFieldValidators.carbs,
  }),
});

type FoodProductFormValues = z.infer<typeof schema>;

interface FoodProductFormProps {
  product?: FoodProduct;
  onSubmit(values: FoodProductFormValues): void;
}

function getInitialValues(product?: FoodProduct): FoodProductFormValues {
  return {
    name: product?.name || '',
    manufacturer: product?.manufacturer || undefined,
    nutrients: {
      calories: product?.nutrients?.calories as number,
      proteins: product?.nutrients?.proteins as number,
      fats: product?.nutrients?.fats as number,
      carbs: product?.nutrients?.carbs as number,
      fibers: (product?.nutrients?.fibers as number) || 0,
    },
  };
}

export function FoodProductForm({ onSubmit, product }: FoodProductFormProps) {
  return (
    <FForm schema={schema} onSubmit={onSubmit} initialValues={getInitialValues(product)}>
      {() => (
        <>
          <FFTextInput name="name" title="Имя" required />
          <FFTextInput name="manufacturer" title="Производитель" />
          <FFNumberInput name="nutrients.calories" title="Калории" required />
          <FFNumberInput name="nutrients.proteins" title="Белки" required />
          <FFNumberInput name="nutrients.fats" title="Жиры" required />
          <FFNumberInput name="nutrients.carbs" title="Углеводы" required />
          <FFNumberInput name="nutrients.fibers" title="Клетчатка" required />
        </>
      )}
    </FForm>
  );
}
