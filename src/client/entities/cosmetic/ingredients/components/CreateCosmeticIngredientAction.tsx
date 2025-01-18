import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import { CosmeticIngredientFormDialog } from './CosmeticIngredientFormDialog';
import { useCreateCosmeticIngredientMutation } from '#/client/store';

export function CreateCosmeticIngredientAction() {
  const dialog = useDialog();

  const createCosmeticIngredientMutation = useCreateCosmeticIngredientMutation({
    onMutate: dialog.close,
  });

  return (
    <>
      <Button onClick={dialog.open}>Добавить ингредиент</Button>

      <CosmeticIngredientFormDialog
        dialog={dialog}
        onSubmit={async values => {
          await createCosmeticIngredientMutation.mutate(values);
        }}
      />
    </>
  );
}
