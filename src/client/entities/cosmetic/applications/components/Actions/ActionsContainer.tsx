import { ActionsComponent } from './Actions';

import {
  useDeleteCosmeticApplicationMutation,
  useUpdateCosmeticApplicationMutation,
} from '../../store';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

type ActionsContainerProps = {
  applicationId: string;
  onDeleted: () => void;
};

export function ActionsContainer({ applicationId, onDeleted }: ActionsContainerProps) {
  const cache = useCosmeticCacheStrict();
  const application = cache.applications.get(applicationId);

  const deletingMutation = useDeleteCosmeticApplicationMutation(applicationId, {
    onSuccess: onDeleted,
  });

  const updatingMutation = useUpdateCosmeticApplicationMutation(applicationId);

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
        delete: deletingMutation.isPending || updatingMutation.isPending,
      }}
    />
  );
}
