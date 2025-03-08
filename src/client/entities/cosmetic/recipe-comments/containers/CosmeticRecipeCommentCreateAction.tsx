import { Button } from '#/ui-lib/atoms/Button';
import { useDialog } from '#/ui-lib/atoms/Dialog';

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
