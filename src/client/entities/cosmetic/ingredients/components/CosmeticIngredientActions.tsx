import { Button } from '#/client/components/Button';
import { ConfirmDialog } from '#/client/components/ConfirmDialog';
import { useDialog } from '#/client/components/Dialog';
import { CosmeticIngredientFormDialog } from './FormDialog';
import {
  useDeleteCosmeticIngredientMutation,
  useUpdateCosmeticIngredientMutation,
} from '#/client/store';
import { CosmeticIngredient } from '#/shared/models/cosmetic';

interface CosmeticIngredientActionsProps {
  ingredient: CosmeticIngredient;
}

export function CosmeticIngredientActions({
  ingredient,
}: CosmeticIngredientActionsProps) {
  const updateDialog = useDialog();
  const deleteDialog = useDialog();

  const updateCosmeticIngredientMutation = useUpdateCosmeticIngredientMutation({
    onMutate: updateDialog.close,
  });
  const deleteCosmeticIngredientMutation = useDeleteCosmeticIngredientMutation({
    onMutate: deleteDialog.close,
  });

  return (
    <>
      <Button onClick={updateDialog.open}>Редактировать</Button>
      <Button onClick={deleteDialog.open}>Удалить</Button>

      {deleteDialog.isOpen && (
        <ConfirmDialog
          dialog={deleteDialog}
          title="Удалить преимущество"
          text="Вы уверены, что хотите удалить ингредиент?"
          submitText="Удалить"
          onSubmit={() => {
            deleteCosmeticIngredientMutation.mutate(ingredient);
          }}
        />
      )}

      {updateDialog.isOpen && (
        <CosmeticIngredientFormDialog
          entity={ingredient}
          dialog={updateDialog}
          isPending={updateCosmeticIngredientMutation.isPending}
          onSubmit={values => {
            updateCosmeticIngredientMutation.mutate({
              ingredient,
              newData: values,
            });
          }}
        />
      )}
    </>
  );
}
