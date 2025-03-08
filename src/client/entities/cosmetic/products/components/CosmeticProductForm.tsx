import { CommonValidators } from '#/shared/models/common';
import { Button } from '#/ui-lib/atoms/Button';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { TextInput } from '#/client/components/TextInput';
import { z } from 'zod';
import { CosmeticProduct } from '#/shared/models/cosmetic';
import { useMemo } from 'react';

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
    <FForm schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {() => {
        return (
          <>
            <Form.Content>
              <FForm.Field title={'Имя'} name="name" required>
                {props => <TextInput {...props} autoFocus />}
              </FForm.Field>
              <FForm.Field title={'Производитель'} name="manufacturer" required>
                {props => <TextInput {...props} />}
              </FForm.Field>
            </Form.Content>
            <Form.Footer>
              {({ disabled }) => {
                return (
                  <Button disabled={disabled} type="submit">
                    Добавить
                  </Button>
                );
              }}
            </Form.Footer>
          </>
        );
      }}
    </FForm>
  );
}
