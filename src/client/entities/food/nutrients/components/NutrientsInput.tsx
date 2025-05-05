import { FoodNutrients, FoodNutrientsValidators } from '#/shared/models/food';
import { Field, Flex, Form, Text } from '#/ui-lib/components';
import { NumberInput } from '#/ui-lib/components/molecules/NumberInput';
import { z } from 'zod';

export const NutrientsInputValidator: z.ZodType<FoodNutrients> = z.object({
  calories: FoodNutrientsValidators.calories,
  carbs: FoodNutrientsValidators.carbs,
  fats: FoodNutrientsValidators.fats,
  fibers: FoodNutrientsValidators.fibers,
  proteins: FoodNutrientsValidators.proteins,
});

type NutrientsInputFormFieldProps = {
  name: string;
};

const FIELDS = [
  {
    name: 'calories',
    label: 'Ккал',
  },
  {
    name: 'proteins',
    label: 'Белки',
  },
  {
    name: 'fats',
    label: 'Жиры',
  },
  {
    name: 'carbs',
    label: 'Углеводы',
  },
  {
    name: 'fibers',
    label: 'Клетчатка',
  },
];

export function NutrientsInputFormField({ name }: NutrientsInputFormFieldProps) {
  return (
    <Flex direction="column" gap={2}>
      <Text variant="header-xs">Макронутриенты</Text>

      {FIELDS.map(field => {
        return (
          <Form.Field<number | undefined> name={`${name}.${field.name}`} required>
            {fieldProps => {
              return (
                <Field {...fieldProps.field}>
                  <Field.Input>
                    <NumberInput
                      {...fieldProps.input}
                      label={field.label}
                      append={
                        <Text wordWrap="unset" minWidth="max-content">
                          на 100 г
                        </Text>
                      }
                    />
                  </Field.Input>
                  <Field.Message />
                </Field>
              );
            }}
          </Form.Field>
        );
      })}
    </Flex>
  );
}
