import {
  CosmeticIngredient,
  CosmeticIngredientValidators,
} from '#/shared/models/cosmetic';
import { z } from 'zod';
import { CosmeticBenefitMultipleSelect } from '#/client/entities/cosmetic/benefits/components/Select';
import { CosmeticINCIIngredientMultipleSelect } from '#/client/entities/cosmetic/inci-indgredients';
import { TextArea } from '#/ui-lib/atoms/TextArea';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { useMemo } from 'react';
import { Button } from '#/ui-lib/atoms/Button';

const schema = z.object({
  name: CosmeticIngredientValidators.name,
  description: CosmeticIngredientValidators.description,
  INCIIngredientIds: CosmeticIngredientValidators.INCIIngredientIds,
  benefitIds: CosmeticIngredientValidators.benefitIds,
});

type FormValues = z.infer<typeof schema>;

export function IngredientForm({
  onSubmit,
  ingredient,
}: {
  onSubmit: (values: FormValues) => void;
  ingredient?: CosmeticIngredient;
}) {
  const initialValues = useMemo((): FormValues => {
    return {
      name: ingredient?.name || '',
      description: ingredient?.description || '',
      INCIIngredientIds: ingredient?.INCIIngredientIds || [],
      benefitIds: ingredient?.benefitIds || [],
    };
  }, [
    ingredient?.INCIIngredientIds,
    ingredient?.benefitIds,
    ingredient?.description,
    ingredient?.name,
  ]);

  return (
    <Form initialValues={initialValues} schema={schema} onSubmit={onSubmit}>
      {() => {
        return (
          <>
            <Form.Field<FormValues['name'] | undefined> name="name">
              {fieldProps => {
                return (
                  <Field required>
                    <Field.Label>Название</Field.Label>
                    <Field.Input>
                      <TextInput {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field<FormValues['description'] | undefined> name="description">
              {fieldProps => {
                return (
                  <Field required>
                    <Field.Label>Описание</Field.Label>
                    <Field.Input>
                      <TextArea {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field<
              FormValues['INCIIngredientIds'] | undefined
            > name="INCIIngredientIds">
              {fieldProps => {
                return (
                  <Field required>
                    <Field.Label>INCI</Field.Label>
                    <Field.Input>
                      <CosmeticINCIIngredientMultipleSelect {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field<FormValues['benefitIds'] | undefined> name="benefitIds">
              {fieldProps => {
                return (
                  <Field required>
                    <Field.Label>Направления действия</Field.Label>
                    <Field.Input>
                      <CosmeticBenefitMultipleSelect {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Button type="submit">
              {ingredient ? 'Сохранить изменения' : 'Сохранить ингредиент'}
            </Button>
          </>
        );
      }}
    </Form>
  );
}
