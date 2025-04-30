import { useDeleteMedicamentMutation, useUpdateMedicamentMutation } from '#/client/store';
import { Medicament } from '#/shared/models/medicament';
import { useDialog } from '#/ui-lib/components/atoms/Dialog';
import { ActionsComponent } from '../components/Actions';
import { FormDialogComponent } from '../components/Form';

type ActionsContainerProps = {
  medicament: Medicament;
  onDeleted: () => void;
};

export function ActionsContainer({ medicament, onDeleted }: ActionsContainerProps) {
  const updatingDialog = useDialog();

  const updateMedicamentMutation = useUpdateMedicamentMutation();

  const deletingMutation = useDeleteMedicamentMutation({
    onSuccess: onDeleted,
  });

  return (
    <>
      {updatingDialog.isOpen && (
        <FormDialogComponent
          entity={medicament}
          dialog={updatingDialog}
          isPending={updateMedicamentMutation.isPending}
          onSubmit={values => {
            updateMedicamentMutation.mutate({ ...values, id: medicament.id });
            updatingDialog.close();
          }}
        />
      )}

      <ActionsComponent
        entity={medicament}
        onDelete={() => {
          deletingMutation.mutate(medicament);
        }}
        onEdit={() => {
          updatingDialog.open();
        }}
        loading={{
          edit: false,
          delete: deletingMutation.isPending,
        }}
        disabled={{
          edit: false,
          delete: deletingMutation.isPending,
        }}
      />
    </>
  );
}
