import { Button } from '#/ui-lib/atoms/Button/Button';
import { z } from 'zod';
import { useMemo } from 'react';
import { CommonValidators } from '#/shared/models/common';
import { Dialog, IDialog } from '#/ui-lib/atoms/Dialog';
import { CosmeticProductSingleSelect } from '#/client/entities/cosmetic/products';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { CosmeticProduct } from '#/shared/models/cosmetic';

const schema = z.object({
  cosmeticProductId: CommonValidators.id,
});

type FormValues = z.infer<typeof schema>;

interface FormDialogComponentProps {
  initialCosmeticProductId?: string;
  loading?: boolean;
  dialog: IDialog;
  onSubmit: (values: FormValues) => void;
  products: CosmeticProduct[];
}

export function FormDialogComponent({
  initialCosmeticProductId,
  loading,
  dialog,
  onSubmit,
  products,
}: FormDialogComponentProps) {
  const initialValues = useMemo(() => {
    return {
      cosmeticProductId: initialCosmeticProductId || '',
    };
  }, [initialCosmeticProductId]);

  return (
    <Dialog dialog={dialog}>
      <Form
        schema={schema}
        initialValues={initialValues}
        disabled={loading}
        onSubmit={onSubmit}>
        {() => {
          return (
            <>
              <Dialog.Header>Добавление косметики</Dialog.Header>
              <Dialog.Content>
                <Form.Field<string | undefined> name="cosmeticProductId">
                  {fieldProps => {
                    return (
                      <Field direction="horizontal">
                        <Field.Label>Продукт</Field.Label>
                        <Field.Input>
                          <CosmeticProductSingleSelect
                            {...fieldProps.input}
                            entities={products}
                          />
                        </Field.Input>
                        <Field.Message />
                      </Field>
                    );
                  }}
                </Form.Field>
              </Dialog.Content>

              <Dialog.Footer>
                <Button disabled={loading} loading={loading} type="submit">
                  Добавить
                </Button>
              </Dialog.Footer>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
}
