import { ActionsComponent } from '../components/Actions';
import {
  useDeleteCosmeticIngredientMutation,
  useUpdateCosmeticIngredientMutation,
} from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { CosmeticIngredientFormDialog } from '../components/FormDialog';
import { CosmeticIngredient } from '#/shared/models/cosmetic';

type ActionsProps = {
  ingredient: CosmeticIngredient;
  onDeleted: () => void;
};

export function Actions({ onDeleted, ...props }: ActionsProps) {
  const updateDialog = useDialog();

  const updateCosmeticIngredientMutation = useUpdateCosmeticIngredientMutation({
    onMutate: updateDialog.close,
  });
  const deleteCosmeticIngredientMutation = useDeleteCosmeticIngredientMutation({
    onMutate: onDeleted,
  });

  return (
    <>
      {updateDialog.isOpen && (
        <CosmeticIngredientFormDialog
          entity={props.ingredient}
          dialog={updateDialog}
          isPending={updateCosmeticIngredientMutation.isPending}
          onSubmit={values => {
            updateCosmeticIngredientMutation.mutate({
              ingredient: props.ingredient,
              newData: values,
            });
          }}
        />
      )}

      <ActionsComponent
        entity={props.ingredient}
        onDelete={ingredient => {
          deleteCosmeticIngredientMutation.mutate(ingredient);
        }}
        onEdit={() => {
          updateDialog.open();
        }}
        disabled={{
          edit: updateCosmeticIngredientMutation.isPending,
          delete: deleteCosmeticIngredientMutation.isPending,
        }}
        loading={{
          edit: updateCosmeticIngredientMutation.isPending,
          delete: deleteCosmeticIngredientMutation.isPending,
        }}
      />
    </>
  );
}
