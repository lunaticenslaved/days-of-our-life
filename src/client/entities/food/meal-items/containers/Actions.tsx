import { ComponentProps } from 'react';
import { ActionsComponent } from '../components/Actions';
import { nonReachable } from '#/shared/utils';
import { useDeleteFoodMealItem, useUpdateFoodMealItem } from '#/client/store/food';
import { useDialog } from '#/client/components/Dialog';
import { FormDialogContainer } from './FormDialog';

type ActionsComponentProps = ComponentProps<typeof ActionsComponent>;

type ActionsContainerProps = Pick<ActionsComponentProps, 'entity'>;

export function ActionsContainer({ entity, ...props }: ActionsContainerProps) {
  const deletingMutation = useDeleteFoodMealItem();
  const updatingMutation = useUpdateFoodMealItem();
  const editingDialog = useDialog();

  return (
    <>
      {editingDialog.isOpen && (
        <FormDialogContainer
          type="update"
          mealItem={entity}
          onUpdated={editingDialog.close}
          dialog={editingDialog}
        />
      )}

      <ActionsComponent
        {...props}
        disabled={{
          delete: deletingMutation.isPending,
          edit: updatingMutation.isPending,
        }}
        entity={entity}
        onAction={(action, mealItem) => {
          if (action === 'delete') {
            deletingMutation.mutate(mealItem);
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
