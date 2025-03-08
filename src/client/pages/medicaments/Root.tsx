import { Medicament } from '#/shared/models/medicament';
import { Button } from '#/ui-lib/atoms/Button';
import {
  useCreateMedicamentMutation,
  useDeleteMedicamentMutation,
  useListMedicamentsQuery,
  useUpdateMedicamentMutation,
} from '#/client/store';
import {
  MedicamentActions,
  MedicamentFormDialog,
  MedicamentsList,
} from '#/client/entities/medicament/components';
import { useState } from 'react';
import { useDialog } from '#/ui-lib/atoms/Dialog';

export default function Page() {
  const medicamentFormDialog = useDialog();
  const listMedicamentsQuery = useListMedicamentsQuery();
  const createMedicamentMutation = useCreateMedicamentMutation();
  const deleteMedicamentMutation = useDeleteMedicamentMutation();
  const updateMedicamentMutation = useUpdateMedicamentMutation();

  const [medicamentToEdit, setMedicamentToEdit] = useState<Medicament>();

  return (
    <div>
      <h1>Медикаменты</h1>
      <Button onClick={medicamentFormDialog.open}>Добавить медикаменты</Button>

      <MedicamentFormDialog
        medicament={medicamentToEdit}
        dialog={medicamentFormDialog}
        onSubmit={values => {
          if (medicamentToEdit) {
            updateMedicamentMutation.mutate({ ...values, id: medicamentToEdit.id });
          } else {
            createMedicamentMutation.mutate(values);
          }

          medicamentFormDialog.close();
        }}
      />

      {listMedicamentsQuery.data ? (
        listMedicamentsQuery.data.length ? (
          <MedicamentsList
            medicaments={listMedicamentsQuery.data}
            renderActions={medicament => (
              <MedicamentActions
                onDelete={() => deleteMedicamentMutation.mutate({ id: medicament.id })}
                onEdit={() => {
                  medicamentFormDialog.open();
                  setMedicamentToEdit(medicament);
                }}
              />
            )}
          />
        ) : (
          <div>No medicaments</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
