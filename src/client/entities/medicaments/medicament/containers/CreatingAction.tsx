import { Button } from '#/ui-lib/atoms/Button/Button';
import { useCreateMedicamentMutation } from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { FormDialogComponent } from '../components/Form';

export function CreatingAction() {
  const dialog = useDialog();

  const creatingMutation = useCreateMedicamentMutation({
    onSuccess: dialog.close,
  });

  return (
    <>
      <FormDialogComponent
        dialog={dialog}
        isPending={creatingMutation.isPending}
        onSubmit={values => {
          creatingMutation.mutate(values);
        }}
      />

      <Button onClick={dialog.open} disabled={creatingMutation.isPending}>
        Создать медикамент
      </Button>
    </>
  );
}
