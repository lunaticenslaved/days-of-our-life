import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';

import { CosmeticRecipeCommentFormDialog } from './CosmeticRecipeCommentFormDialog';

interface CosmeticRecipeCommentCreateActionProps {
  recipeId: string;
}

export function CosmeticRecipeCommentCreateAction({
  recipeId,
}: CosmeticRecipeCommentCreateActionProps) {
  const creatingDialog = useDialog();

  return (
    <>
      <CosmeticRecipeCommentFormDialog
        dialog={creatingDialog}
        onCreated={creatingDialog.close}
        recipeId={recipeId}
      />
      <Button onClick={creatingDialog.open}>Добавить</Button>
    </>
  );
}
