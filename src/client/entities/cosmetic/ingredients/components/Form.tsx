import {
  CosmeticIngredient,
  CosmeticIngredientValidators,
} from '#/shared/models/cosmetic';
import { z } from 'zod';
import { CosmeticBenefitTagSelect } from '#/client/entities/cosmetic/benefits';
import { CosmeticINCIIngredientTagSelect } from '#/client/entities/cosmetic/inci-indgredients';
import { TextArea } from '#/ui-lib/atoms/TextArea';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { useMemo } from 'react';
import { Button } from '#/ui-lib/atoms/Button/Button';
import {
  useListCosmeticBenefitsQuery,
  useListCosmeticINCIIngredientsQuery,
} from '#/client/store/cosmetic';

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
  const { data: ingredients } = useListCosmeticINCIIngredientsQuery();
  const { data: benefits } = useListCosmeticBenefitsQuery();

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

  if (!ingredients || !benefits) {
    return <div> Loading...</div>;
  }

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
                  <Field>
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
                      <CosmeticINCIIngredientTagSelect
                        {...fieldProps.input}
                        ingredients={ingredients}
                      />
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
                      <CosmeticBenefitTagSelect
                        {...fieldProps.input}
                        benefits={benefits}
                      />
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
