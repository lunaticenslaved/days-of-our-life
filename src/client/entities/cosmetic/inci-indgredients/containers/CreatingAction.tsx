import { Button } from '#/ui-lib/atoms/Button';
import { useCreateCosmeticINCIIngredientMutation } from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { FormDialog } from '../components/FormDialog';

interface CreatingActionProps {}

export function CreatingAction(_: CreatingActionProps) {
  const dialog = useDialog();

  const creatingMutation = useCreateCosmeticINCIIngredientMutation({
    onMutate: dialog.close,
  });

  return (
    <>
      <FormDialog
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
