import { FormDialog } from '../components/FormDialog';
import {
  useDeleteCosmeticINCIIngredientMutation,
  useUpdateCosmeticINCIIngredientMutation,
} from '#/client/store';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { useDialog } from '#/ui-lib/atoms/Dialog';

import { ActionsComponent } from '../components/Actions';

interface ActionsContainerProps {
  ingredient: CosmeticINCIIngredient;
  onDeleted: () => void;
}

export function ActionsContainer({ ingredient, onDeleted }: ActionsContainerProps) {
  const updatingMutation = useUpdateCosmeticINCIIngredientMutation();
  const deletingMutation = useDeleteCosmeticINCIIngredientMutation({
    onMutate: onDeleted,
  });

  const editingDialog = useDialog();

  return (
    <>
      <FormDialog
        dialog={editingDialog}
        entity={ingredient}
        isPending={updatingMutation.isPending}
        onSubmit={newValues => {
          updatingMutation.mutate({
            ingredient,
            newData: newValues,
          });
        }}
      />

      <ActionsComponent
        loading={{
          delete: deletingMutation.isPending,
          edit: updatingMutation.isPending,
        }}
        disabled={{
          delete: deletingMutation.isPending,
          edit: updatingMutation.isPending,
        }}
        entity={ingredient}
        onDelete={() => {
          deletingMutation.mutate(ingredient);
        }}
        onEdit={() => {
          editingDialog.open();
        }}
      />
    </>
  );
}
