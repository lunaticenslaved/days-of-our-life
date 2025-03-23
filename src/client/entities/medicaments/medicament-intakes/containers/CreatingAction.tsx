import { Button } from '#/ui-lib/atoms/Button';
import {
  useCreateMedicamentIntakeMutation,
  useListMedicamentsQuery,
} from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { FormDialogComponent } from '../components/Form';
import { DateFormat } from '#/shared/models/date';

export function CreatingAction(props: {
  date: DateFormat;
  dayPartId: string;
  medicamentId?: string;
}) {
  const dialog = useDialog();

  const creatingMutation = useCreateMedicamentIntakeMutation({
    onSuccess: dialog.close,
  });

  const listMedicamentsQuery = useListMedicamentsQuery();

  return (
    <>
      <FormDialogComponent
        {...props}
        dialog={dialog}
        medicaments={listMedicamentsQuery.data || []}
        isPending={creatingMutation.isPending}
        onSubmit={values => {
          creatingMutation.mutate(values);
        }}
      />

      <Button onClick={dialog.open} disabled={creatingMutation.isPending}>
        Добавить медикамент
      </Button>
    </>
  );
}
