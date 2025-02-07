import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { useDialog } from '#/client/components/Dialog';
import { CosmeticINCIIngredientFormDialog } from '#/client/entities/cosmetic/inci-indgredients/components/FormDialog';
import {
  useDeleteCosmeticINCIIngredientMutation,
  useUpdateCosmeticINCIIngredientMutation,
} from '#/client/store';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { nonReachable } from '#/shared/utils';

type Actions = 'edit' | 'delete';

const BaseComponent = createEntityActions<CosmeticINCIIngredient, Actions>({
  entityName: 'CosmeticINCIIngredient',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});

interface CosmeticINCIIngredientActionsProps {
  ingredient: CosmeticINCIIngredient;
  onDelete?(): void;
}

export function CosmeticINCIIngredientActions({
  ingredient,
  onDelete,
}: CosmeticINCIIngredientActionsProps) {
  const updatingMutation = useUpdateCosmeticINCIIngredientMutation();
  const deletingMutation = useDeleteCosmeticINCIIngredientMutation({
    onSuccess: () => {
      onDelete?.();
    },
  });

  const editingDialog = useDialog();

  return (
    <>
      <CosmeticINCIIngredientFormDialog
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

      <BaseComponent
        disabled={{
          delete: deletingMutation.isPending,
          edit: updatingMutation.isPending,
        }}
        entity={ingredient}
        onAction={action => {
          if (action === 'delete') {
            deletingMutation.mutate(ingredient);
          } else if (action === 'edit') {
            editingDialog.open();
          } else {
            nonReachable(action);
          }
        }}
      />
    </>
  );
}
