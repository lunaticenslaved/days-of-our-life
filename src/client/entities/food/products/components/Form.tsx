import { Button } from '#/client/components/Button';
import {
  FoodNutrientsInputValidator,
  FoodNutrientsInputFormField,
} from '#/client/entities/food/nutrients';
import {
  FoodProduct,
  FoodProductValidators,
  multiplyNutrients,
  roundNutrients,
} from '#/shared/models/food';
import { Form } from '#/ui-lib/atoms/Form/FinalForm';
import { TextInputField } from '#/ui-lib/molecules/TextInputField';
import { useMemo } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: FoodProductValidators.name,
  manufacturer: FoodProductValidators.manufacturer,
  nutrientsPer100Gramm: FoodNutrientsInputValidator,
});

type FormValues = z.infer<typeof schema>;

function getInitialValues(product?: FoodProduct): FormValues {
  if (product) {
    const nutrientsPer100Gramm = roundNutrients(
      multiplyNutrients(product.nutrientsPerGram, 100),
    );

    return {
      name: product.name,
      manufacturer: product.manufacturer || null,
      nutrientsPer100Gramm,
    };
  }

  return {
    name: '',
    manufacturer: '',
    nutrientsPer100Gramm: {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0,
      fibers: 0,
    },
  };
}

interface ProductFormProps {
  product?: FoodProduct;
  onSubmit(values: FormValues): void | Promise<void>;
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const initialValues = useMemo(() => {
    return getInitialValues(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return (
    <Form schema={schema} initialValues={initialValues} onSubmit={onSubmit}>
      {() => {
        return (
          <>
            <Form.Field name="name" required>
              {fieldProps => {
                return <TextInputField {...fieldProps} label="Имя" />;
              }}
            </Form.Field>

            <Form.Field name="manufacturer">
              {fieldProps => {
                return <TextInputField {...fieldProps} label="Производитель" />;
              }}
            </Form.Field>

            <FoodNutrientsInputFormField name="nutrientsPer100Gramm" />

            <Button type="submit">Сохранить</Button>
          </>
        );
      }}
    </Form>
  );
}
