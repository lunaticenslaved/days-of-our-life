import {
  CosmeticIngredient,
  CosmeticIngredientValidators,
} from '#/shared/models/cosmetic';
import { z } from 'zod';
import { CosmeticBenefitTagSelect } from '#/client/entities/cosmetic/benefits';
import { CosmeticINCIIngredientTagSelect } from '#/client/entities/cosmetic/inci-indgredients';
import { TextArea } from '#/ui-lib/components/atoms/TextArea';
import { TextInput } from '#/ui-lib/components/molecules/TextInput';
import { Form } from '#/ui-lib/components/atoms/Form';
import { Field } from '#/ui-lib/components/atoms/Field';
import { useMemo } from 'react';
import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { useListCosmeticBenefitsQuery } from '#/client/store/cosmetic';
import { Flex } from '#/ui-lib/components/atoms/Flex';

const schema = z.object({
  name: CosmeticIngredientValidators.name,
  description: CosmeticIngredientValidators.description,
  INCIIngredientIds: CosmeticIngredientValidators.INCIIngredientIds,
  benefitIds: CosmeticIngredientValidators.benefitIds,
});

type FormValues = z.infer<typeof schema>;

export function FormComponent({
  onSubmit,
  ingredient,
}: {
  onSubmit: (values: FormValues) => void;
  ingredient?: CosmeticIngredient;
}) {
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

  if (!benefits) {
    return <div> Loading...</div>;
  }

  return (
    <Form initialValues={initialValues} schema={schema} onSubmit={onSubmit}>
      {() => {
        return (
          <Flex direction="column" maxWidth="700px" gap={4}>
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
                  <Field>
                    <Field.Label>INCI</Field.Label>
                    <Field.Input>
                      <CosmeticINCIIngredientTagSelect {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field<FormValues['benefitIds'] | undefined> name="benefitIds">
              {fieldProps => {
                return (
                  <Field>
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
          </Flex>
        );
      }}
    </Form>
  );
}
