import {
  CosmeticINCIIngredientValidators,
  CosmeticINCIIngredient,
} from '#/shared/models/cosmetic';
import { z } from 'zod';
import { TextInput, Form, Field, Button } from '#/ui-lib/components';
import { useMemo } from 'react';
import { useListCosmeticINCIIngredientsQuery } from '#/client/entities/cosmetic/inci-indgredients';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { useListCosmeticBenefitsQuery } from '#/client/entities/cosmetic/benefits';

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
