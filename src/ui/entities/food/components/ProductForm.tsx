import {
  divideNutrients,
  FoodProduct,
  FoodValidators,
  multiplyNutrients,
  roundNutrients,
} from '#shared/models/food';
import { Button } from '#ui/components/Button';
import { FForm } from '#ui/components/FForm';
import { Form } from '#ui/components/Form';
import { NumberInput } from '#ui/components/NumberInput';
import { TextInput } from '#ui/components/TextInput';
import { z } from 'zod';

const schema = z.object({
  name: FoodValidators.name,
  manufacturer: FoodValidators.manufacturer,
  nutrients: FoodValidators.nutrients,
});

type FoodProductFormValues = z.infer<typeof schema>;

interface FoodProductFormProps {
  product?: FoodProduct;
  onSubmit(values: FoodProductFormValues): void | Promise<void>;
}

function getInitialValues(product?: FoodProduct): Partial<FoodProductFormValues> {
  if (product) {
    const nutrients = roundNutrients(multiplyNutrients(product.nutrientsPerGram, 100));

    return {
      name: product?.name || '',
      manufacturer: product?.manufacturer || undefined,
      nutrients: nutrients,
    };
  }

  return {};
}

export function FoodProductForm({ onSubmit, product }: FoodProductFormProps) {
  return (
    <FForm
      schema={schema}
      onSubmit={({ nutrients, ...other }) => {
        return onSubmit({
          ...other,
          nutrients: divideNutrients(nutrients, 100),
        });
      }}
      initialValues={getInitialValues(product)}>
      {({ handleSubmit }) => (
        <>
          <Form.Content>
            <FForm.Field title="Имя" name="name" required>
              {TextInput}
            </FForm.Field>

            <FForm.Field title="Производитель" name="manufacturer">
              {TextInput}
            </FForm.Field>

            <FForm.Field name="nutrients.calories" title="Калории в 100Г" required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field name="nutrients.proteins" title="Белки в 100Г" required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field name="nutrients.fats" title="Жиры в 100Г" required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field name="nutrients.carbs" title="Углеводы в 100Г" required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field name="nutrients.fibers" title="Клетчатка в 100Г" required>
              {NumberInput}
            </FForm.Field>
          </Form.Content>

          <Form.Footer>
            <Button type="submit" onClick={handleSubmit}>
              Сохранить
            </Button>
          </Form.Footer>
        </>
      )}
    </FForm>
  );
}
