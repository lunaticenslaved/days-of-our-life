import { Button } from '#/client/components/Button';
import { ConfirmDialog } from '#/client/components/ConfirmDialog';
import { useDialog } from '#/client/components/Dialog';
import { useDeleteCosmeticRecipeCommentMutation } from '#/client/store';
import { CosmeticRecipeComment } from '#/shared/models/cosmetic';

interface CosmeticRecipeCommentActionsProps {
  recipeId: string;
  comment: CosmeticRecipeComment;
}

export function CosmeticRecipeCommentActions({
  recipeId,
  comment,
}: CosmeticRecipeCommentActionsProps) {
  const deleteRecipeMutation = useDeleteCosmeticRecipeCommentMutation(recipeId);

  const deletingConfirmDialog = useDialog();

  return (
    <div style={{ display: 'flex' }}>
      <ConfirmDialog
        dialog={deletingConfirmDialog}
        onCancel={deletingConfirmDialog.close}
        title="Удалить комментарий?"
        text="Комментарий будет удалён без возможности восстановления"
        submitText="Удалить"
        onSubmit={() => {
          deleteRecipeMutation.mutate(comment);
        }}
      />

      <Button
        onClick={deletingConfirmDialog.open}
        disabled={deleteRecipeMutation.isPending}>
        Удалить
      </Button>
    </div>
  );
}
