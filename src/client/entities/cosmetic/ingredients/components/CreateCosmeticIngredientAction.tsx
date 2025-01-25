import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import { CosmeticIngredientFormDialog } from './CosmeticIngredientFormDialog';
import { useCreateCosmeticIngredientMutation } from '#/client/store';

export function CreateCosmeticIngredientAction() {
  const dialog = useDialog();

  const { mutate, isPending } = useCreateCosmeticIngredientMutation({
    onMutate: dialog.close,
  });

  return (
    <>
      <Button disabled={isPending} onClick={dialog.open}>
        Добавить ингредиент
      </Button>

      <CosmeticIngredientFormDialog
        dialog={dialog}
        onSubmit={async values => {
          await mutate(values);
        }}
      />
    </>
  );
}
