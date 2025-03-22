import { useListCosmeticProductsQuery } from '#/client/store/cosmetic';
import { useAddCosmeticProductToDateMutation } from '#/client/store/days';
import { DateFormat } from '#/shared/models/date';
import { Button } from '#/ui-lib/atoms/Button';
import { useDialog } from '#/ui-lib/atoms/Dialog';

import { FormDialogComponent } from '../components/Form';

interface CreatingActionContainerProps {
  date: DateFormat;
  dayPartId: string;
  cosmeticProductId?: string;
}

export function CreatingActionContainer(props: CreatingActionContainerProps) {
  const dialog = useDialog();

  const addCosmeticProductMutation = useAddCosmeticProductToDateMutation({
    onMutate: dialog.close,
  });
  const listCosmeticProductsQuery = useListCosmeticProductsQuery();

  return (
    <>
      {dialog.isOpen && (
        <FormDialogComponent
          dialog={dialog}
          initialCosmeticProductId={props.cosmeticProductId}
          products={listCosmeticProductsQuery.data || []}
          onSubmit={formValues => {
            addCosmeticProductMutation.mutate({
              date: props.date,
              dayPartId: props.dayPartId,
              cosmeticProductId: formValues.cosmeticProductId,
            });
          }}
        />
      )}

      <Button onClick={dialog.open}>Добавить</Button>
    </>
  );
}
