import { useDeleteMedicamentIntakeMutation } from '#/client/store';
import { MedicamentIntake } from '#/shared/models/medicament';
import { ActionsComponent } from '../components/Actions';

type ActionsContainerProps = {
  intake: MedicamentIntake;
  onDeleted: () => void;
};

export function ActionsContainer({ intake, onDeleted }: ActionsContainerProps) {
  const deletingMutation = useDeleteMedicamentIntakeMutation({
    onSuccess: onDeleted,
  });

  return (
    <>
      <ActionsComponent
        entity={intake}
        onDelete={() => {
          deletingMutation.mutate(intake);
        }}
        loading={{
          delete: deletingMutation.isPending,
        }}
        disabled={{
          delete: deletingMutation.isPending,
        }}
      />
    </>
  );
}
