import { Button } from '#/ui-lib/atoms/Button';
import { useCreateCosmeticINCIIngredientMutation } from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';
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
