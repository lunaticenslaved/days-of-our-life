import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { ActionsComponent } from '../components/Actions';

import { useDeleteCosmeticApplicationMutation } from '../store';

type ActionsContainerProps = {
  application: CosmeticApplication;
  onDeleted: () => void;
};

export function ActionsContainer({ application, onDeleted }: ActionsContainerProps) {
  const deletingMutation = useDeleteCosmeticApplicationMutation(application.id, {
    onSuccess: onDeleted,
  });

  return (
    <ActionsComponent
      entity={application}
      onDelete={() => {
        deletingMutation.mutate(application);
      }}
      loading={{
        delete: deletingMutation.isPending,
      }}
      disabled={{
        delete: deletingMutation.isPending,
      }}
    />
  );
}
