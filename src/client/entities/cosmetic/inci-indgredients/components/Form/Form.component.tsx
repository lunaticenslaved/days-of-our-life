import {
  CosmeticINCIIngredientValidators,
  CosmeticINCIIngredient,
} from '#/shared/models/cosmetic';
import { z } from 'zod';
import { TextInput } from '#/ui-lib/molecules/TextInput';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { useMemo } from 'react';
import { Button } from '#/ui-lib/atoms/Button/Button';
import { useListCosmeticBenefitsQuery } from '#/client/store/cosmetic';
import { useListCosmeticINCIIngredientsQuery } from '#/client/entities/cosmetic/inci-indgredients';
import { Flex } from '#/ui-lib/atoms/Flex';

const schema = z.object({
  name: CosmeticINCIIngredientValidators.name,
});

type FormValues = z.infer<typeof schema>;

export function FormComponent({
  onSubmit,
  ingredient,
}: {
  onSubmit: (values: FormValues) => void;
  ingredient?: CosmeticINCIIngredient;
}) {
  const { data: ingredients } = useListCosmeticINCIIngredientsQuery();
  const { data: benefits } = useListCosmeticBenefitsQuery();

  const initialValues = useMemo((): FormValues => {
    return {
      name: ingredient?.name || '',
    };
  }, [ingredient]);

  if (!ingredients || !benefits) {
    return <div> Loading...</div>;
  }

  return (
    <Form initialValues={initialValues} schema={schema} onSubmit={onSubmit}>
      {() => {
        return (
          <Flex direction="column" gap={4} maxWidth="700px">
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

            <Button type="submit">
              {ingredient ? 'Сохранить изменения' : 'Добавить ингредиент'}
            </Button>
          </Flex>
        );
      }}
    </Form>
  );
}
