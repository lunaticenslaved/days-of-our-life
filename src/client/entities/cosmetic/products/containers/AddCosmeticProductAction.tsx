import { Button } from '#/ui-lib/atoms/Button';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import {
  useAddCosmeticProductToDateMutation,
  useListCosmeticProductsQuery,
} from '#/client/store';
import { DateFormat } from '#/shared/models/date';
import { z } from 'zod';
import { CosmeticProductSingleSelect } from '../components/CosmeticProductSelect';
import { useMemo } from 'react';
import { CommonValidators } from '#/shared/models/common';
import { Dialog, useDialog } from '#/ui-lib/atoms/Dialog';

const schema = z.object({
  cosmeticProductId: CommonValidators.id,
});

interface AddCosmeticProductActionProps {
  date: DateFormat;
  dayPartId: string;
  cosmeticProductId?: string;
}

export function AddCosmeticProductAction({
  date,
  dayPartId,
  cosmeticProductId,
}: AddCosmeticProductActionProps) {
  const dialog = useDialog();
  const initialValues = useMemo(() => {
    return {
      cosmeticProductId,
    };
  }, [cosmeticProductId]);

  const addCosmeticProductMutation = useAddCosmeticProductToDateMutation();

  const listCosmeticProductsQuery = useListCosmeticProductsQuery();

  return (
    <>
      <Dialog dialog={dialog}>
        <FForm
          schema={schema}
          initialValues={initialValues}
          disabled={addCosmeticProductMutation.isPending}
          onSubmit={values => {
            dialog.close();
            addCosmeticProductMutation.mutate({
              date,
              dayPartId,
              cosmeticProductId: values.cosmeticProductId,
            });
          }}>
          {() => {
            return (
              <>
                <Dialog.Header>Добавление косметики</Dialog.Header>
                <Dialog.Content>
                  <Form.Content>
                    <FForm.Field name="cosmeticProductId">
                      {inputProps => (
                        <CosmeticProductSingleSelect
                          {...inputProps}
                          entities={listCosmeticProductsQuery.data || []}
                        />
                      )}
                    </FForm.Field>
                  </Form.Content>
                </Dialog.Content>

                <Dialog.Footer>
                  <Form.Footer>
                    {({ disabled }) => (
                      <Button disabled={disabled} type="submit">
                        Добавить
                      </Button>
                    )}
                  </Form.Footer>
                </Dialog.Footer>
              </>
            );
          }}
        </FForm>
      </Dialog>
      <Button onClick={dialog.open}>Добавить</Button>
    </>
  );
}
