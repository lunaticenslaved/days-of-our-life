import { Button } from '#/ui-lib/atoms/Button';
import { CosmeticIngredientFormDialog } from '../components/FormDialog';
import { useCreateCosmeticIngredientMutation } from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';

export function CreatingAction() {
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
        isPending={isPending}
        dialog={dialog}
        onSubmit={async values => {
          await mutate(values);
        }}
      />
    </>
  );
}
