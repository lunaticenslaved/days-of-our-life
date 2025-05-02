import {
  FoodNutrientsInputFormField,
  FoodNutrientsInputValidator,
} from '#/client/entities/food/nutrients';
import {
  FoodProduct,
  FoodProductValidators,
  multiplyNutrients,
  roundNutrients,
} from '#/shared/models/food';
import { Field, TextInput, Button, Form, Flex } from '#/ui-lib/components';
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

interface FormComponentProps {
  product?: FoodProduct;
  onSubmit(values: FormValues): void | Promise<void>;
}

export function FormComponent({ product, onSubmit }: FormComponentProps) {
  const initialValues = useMemo(() => {
    return getInitialValues(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  return (
    <Form schema={schema} initialValues={initialValues} onSubmit={onSubmit}>
      {() => {
        return (
          <Flex direction="column" gap={2} maxWidth="700px">
            <Form.Field name="name" required>
              {fieldProps => {
                return (
                  <Field {...fieldProps.field}>
                    <Field.Label>Имя</Field.Label>
                    <Field.Input>
                      <TextInput
                        {...fieldProps.input}
                        onValueUpdate={newValue => {
                          fieldProps.input.onValueUpdate(newValue || '');
                        }}
                      />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field name="manufacturer">
              {fieldProps => {
                return (
                  <Field {...fieldProps.field}>
                    <Field.Label>Производитель</Field.Label>
                    <Field.Input>
                      <TextInput
                        {...fieldProps.input}
                        onValueUpdate={newValue => {
                          fieldProps.input.onValueUpdate(newValue || '');
                        }}
                      />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <FoodNutrientsInputFormField name="nutrientsPer100Gramm" />

            <Button type="submit">Сохранить</Button>
          </Flex>
        );
      }}
    </Form>
  );
}
