import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticINCIIngredientFormDialog } from '#/client/entities/cosmetic/inci-indgredients/components/FormDialog';
import {
  useDeleteCosmeticINCIIngredientMutation,
  useUpdateCosmeticINCIIngredientMutation,
} from '#/client/store';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { useDialog } from '#/ui-lib/atoms/Dialog';

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
