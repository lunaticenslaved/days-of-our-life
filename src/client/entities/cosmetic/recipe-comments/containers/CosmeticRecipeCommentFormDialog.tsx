import { Dialog, IUseDialog } from '#/client/components/Dialog';
import { useCreateCosmeticRecipeCommentMutation } from '#/client/store';
import { CosmeticRecipeCommentForm } from '../components/CosmeticRecipeCommentForm';

interface CosmeticRecipeCommentFormDialogProps {
  recipeId: string;
  dialog: IUseDialog;
  onCreated?(): void;
}

export function CosmeticRecipeCommentFormDialog({
  recipeId,
  dialog,
  onCreated,
}: CosmeticRecipeCommentFormDialogProps) {
  const creatingMutation = useCreateCosmeticRecipeCommentMutation(recipeId, {
    onMutate: () => {
      onCreated?.();
    },
  });

  return (
    <Dialog dialog={dialog}>
      <Dialog.Header>Добавить комментарий</Dialog.Header>
      <Dialog.Content>
        <CosmeticRecipeCommentForm onSubmit={creatingMutation.mutate} />
      </Dialog.Content>
    </Dialog>
  );
}
