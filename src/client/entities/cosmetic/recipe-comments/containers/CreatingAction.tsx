import { useCreateCosmeticRecipeCommentMutation } from '#/client/store/cosmetic';
import { Button } from '#/ui-lib/atoms/Button';
import { Dialog, useDialog } from '#/ui-lib/atoms/Dialog';

import { FormComponent } from '../components/Form';

type CreatingActionContainerProps = {
  recipeId: string;
};

export function CreatingActionContainer({ recipeId }: CreatingActionContainerProps) {
  const dialog = useDialog();

  const creatingMutation = useCreateCosmeticRecipeCommentMutation(recipeId, {
    onMutate: dialog.close,
  });

  return (
    <>
      <Dialog dialog={dialog}>
        <Dialog.Header>Добавить комментарий</Dialog.Header>
        <Dialog.Content>
          <FormComponent onSubmit={creatingMutation.mutate} />
        </Dialog.Content>
      </Dialog>

      <Button onClick={dialog.open}>Добавить комментарий</Button>
    </>
  );
}
