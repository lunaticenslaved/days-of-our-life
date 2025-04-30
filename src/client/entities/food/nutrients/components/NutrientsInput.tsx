import { FoodNutrients, FoodNutrientsValidators } from '#/shared/models/food';
import { Field } from '#/ui-lib/components/atoms/Field';
import { Form } from '#/ui-lib/components/atoms/Form/FinalForm';
import { NumberInput } from '#/ui-lib/components/molecules/NumberInput';
import { z } from 'zod';

export const NutrientsInputValidator: z.ZodType<FoodNutrients> = z.object({
  calories: FoodNutrientsValidators.calories,
  carbs: FoodNutrientsValidators.carbs,
  fats: FoodNutrientsValidators.fats,
  fibers: FoodNutrientsValidators.fibers,
  proteins: FoodNutrientsValidators.proteins,
});

type NutrientsInputValues = z.infer<typeof NutrientsInputValidator>;

type NutrientsInputFormFieldProps = {
  name: string;
};

export function NutrientsInputFormField({ name }: NutrientsInputFormFieldProps) {
  return (
    <>
      <Form.Field<NutrientsInputValues['calories'] | undefined>
        name={`${name}.calories`}
        required>
        {fieldProps => {
          return (
            <Field {...fieldProps.field}>
              <Field.Label>Калорий на 100 г</Field.Label>
              <Field.Input>
                <NumberInput {...fieldProps.input} />
              </Field.Input>
              <Field.Message />
            </Field>
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['proteins'] | undefined>
        name={`${name}.proteins`}
        required>
        {fieldProps => {
          return (
            <Field {...fieldProps.field}>
              <Field.Label>Белков на 100 г</Field.Label>
              <Field.Input>
                <NumberInput {...fieldProps.input} />
              </Field.Input>
              <Field.Message />
            </Field>
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['fats'] | undefined>
        name={`${name}.fats`}
        required>
        {fieldProps => {
          return (
            <Field {...fieldProps.field}>
              <Field.Label>Жира на 100 г</Field.Label>
              <Field.Input>
                <NumberInput {...fieldProps.input} />
              </Field.Input>
              <Field.Message />
            </Field>
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['carbs'] | undefined>
        name={`${name}.carbs`}
        required>
        {fieldProps => {
          return (
            <Field {...fieldProps.field}>
              <Field.Label>Углеводов на 100 г</Field.Label>
              <Field.Input>
                <NumberInput {...fieldProps.input} />
              </Field.Input>
              <Field.Message />
            </Field>
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['fibers'] | undefined>
        name={`${name}.fibers`}
        required>
        {fieldProps => {
          return (
            <Field {...fieldProps.field}>
              <Field.Label>Клетчатка на 100 г</Field.Label>
              <Field.Input>
                <NumberInput {...fieldProps.input} />
              </Field.Input>
              <Field.Message />
            </Field>
          );
        }}
      </Form.Field>
    </>
  );
}
