import { FoodNutrients, FoodNutrientsValidators } from '#/shared/models/food';
import { Form } from '#/ui-lib/atoms/Form/FinalForm';
import { NumberInputField } from '#/ui-lib/molecules/NumberInputField';
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
            <NumberInputField
              label="Калорий на 100 г"
              field={{ ...fieldProps.field, required: true }}
              input={{ ...fieldProps.input, value: fieldProps.input.value || 0 }}
            />
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['proteins'] | undefined>
        name={`${name}.proteins`}
        required>
        {fieldProps => {
          return (
            <NumberInputField
              label="Белков на 100 г"
              field={{ ...fieldProps.field, required: true }}
              input={{ ...fieldProps.input, value: fieldProps.input.value || 0 }}
            />
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['fats'] | undefined>
        name={`${name}.fats`}
        required>
        {fieldProps => {
          return (
            <NumberInputField
              label="Жира на 100 г"
              field={{ ...fieldProps.field, required: true }}
              input={{ ...fieldProps.input, value: fieldProps.input.value || 0 }}
            />
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['carbs'] | undefined>
        name={`${name}.carbs`}
        required>
        {fieldProps => {
          return (
            <NumberInputField
              label="Углеводов на 100 г"
              field={{ ...fieldProps.field, required: true }}
              input={{ ...fieldProps.input, value: fieldProps.input.value || 0 }}
            />
          );
        }}
      </Form.Field>

      <Form.Field<NutrientsInputValues['fibers'] | undefined>
        name={`${name}.fibers`}
        required>
        {fieldProps => {
          return (
            <NumberInputField
              label="Клетчатка на 100 г"
              field={{ ...fieldProps.field, required: true }}
              input={{ ...fieldProps.input, value: fieldProps.input.value || 0 }}
            />
          );
        }}
      </Form.Field>
    </>
  );
}
