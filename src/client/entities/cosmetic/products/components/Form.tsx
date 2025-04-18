import { CommonValidators } from '#/shared/models/common';
import { Button } from '#/ui-lib/atoms/Button/Button';
import { z } from 'zod';
import { CosmeticProduct } from '#/shared/models/cosmetic';
import { useMemo } from 'react';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { TextInput } from '#/ui-lib/molecules/TextInputField';

const schema = z.object({
  name: CommonValidators.str(255),
  manufacturer: CommonValidators.str(255),
});

type CosmeticProductFormValues = z.infer<typeof schema>;

function getInitialValues(product?: CosmeticProduct): CosmeticProductFormValues {
  return {
    name: product?.name || '',
    manufacturer: product?.manufacturer || '',
  };
}

interface CosmeticProductFormProps {
  onSubmit(values: CosmeticProductFormValues): void;
  cosmeticProduct?: CosmeticProduct;
}

export function CosmeticProductForm({
  cosmeticProduct,
  onSubmit,
}: CosmeticProductFormProps) {
  const initialValues = useMemo(() => {
    return getInitialValues(cosmeticProduct);
  }, [cosmeticProduct]);

  return (
    <Form schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {() => {
        return (
          <>
            <Form.Field<string | undefined> name="name">
              {fieldProps => {
                return (
                  <Field direction="horizontal">
                    <Field.Label>Название</Field.Label>
                    <Field.Input>
                      <TextInput {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field<string | undefined> name="manufacturer">
              {fieldProps => {
                return (
                  <Field direction="horizontal">
                    <Field.Label>Производитель</Field.Label>
                    <Field.Input>
                      <TextInput {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Button type="submit">Добавить</Button>
          </>
        );
      }}
    </Form>
  );
}
