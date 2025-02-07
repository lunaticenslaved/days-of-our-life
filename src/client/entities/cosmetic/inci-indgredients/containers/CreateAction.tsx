import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import { useCreateCosmeticINCIIngredientMutation } from '#/client/store';
import { CosmeticINCIIngredientFormDialog } from '../components/FormDialog';

interface CosmeticINCIIngredientCreateActionProps {}

export function CosmeticINCIIngredientCreateAction(
  _: CosmeticINCIIngredientCreateActionProps,
) {
  const dialog = useDialog();

  const creatingMutation = useCreateCosmeticINCIIngredientMutation({
    onMutate: dialog.close,
  });

  return (
    <>
      <CosmeticINCIIngredientFormDialog
        isPending={creatingMutation.isPending}
        dialog={dialog}
        onSubmit={values => {
          creatingMutation.mutate(values);
        }}
      />

      <Button onClick={dialog.open}>Создать</Button>
    </>
  );
}
