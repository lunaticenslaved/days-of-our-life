import {
  FoodProduct,
  FoodValidators,
  multiplyNutrients,
  roundNutrients,
} from '#/shared/models/food';
import { Button } from '#/client/components/Button';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { NumberInput } from '#/client/components/NumberInput';
import { TextInput } from '#/client/components/TextInput';
import { useMemo } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: FoodValidators.name,
  manufacturer: FoodValidators.manufacturer,
  nutrientsPer100Gramm: FoodValidators.nutrients,
});

type FoodProductFormValues = z.infer<typeof schema>;

interface FoodProductFormProps {
  product?: FoodProduct;
  onSubmit(values: FoodProductFormValues): void | Promise<void>;
}

function getInitialValues(product?: FoodProduct): Partial<FoodProductFormValues> {
  if (product) {
    const nutrientsPer100Gramm = roundNutrients(
      multiplyNutrients(product.nutrientsPerGram, 100),
    );

    return {
      name: product?.name || '',
      manufacturer: product?.manufacturer || undefined,
      nutrientsPer100Gramm,
    };
  }

  return {};
}

export function FoodProductForm({ onSubmit, product }: FoodProductFormProps) {
  const initialValues = useMemo(() => getInitialValues(product), [product]);

  return (
    <FForm schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
        <>
          <Form.Content>
            <FForm.Field title="Имя" name="name" required>
              {TextInput}
            </FForm.Field>

            <FForm.Field title="Производитель" name="manufacturer">
              {TextInput}
            </FForm.Field>

            <FForm.Field
              name="nutrientsPer100Gramm.calories"
              title="Калории в 100Г"
              required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field
              name="nutrientsPer100Gramm.proteins"
              title="Белки в 100Г"
              required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field name="nutrientsPer100Gramm.fats" title="Жиры в 100Г" required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field
              name="nutrientsPer100Gramm.carbs"
              title="Углеводы в 100Г"
              required>
              {NumberInput}
            </FForm.Field>

            <FForm.Field
              name="nutrientsPer100Gramm.fibers"
              title="Клетчатка в 100Г"
              required>
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
