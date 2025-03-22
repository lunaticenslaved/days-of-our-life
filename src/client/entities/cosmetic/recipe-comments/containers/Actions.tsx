import { useDeleteCosmeticRecipeCommentMutation } from '#/client/store';
import { CosmeticRecipeComment } from '#/shared/models/cosmetic';
import { ActionsComponent } from '../components/Actions';

type ActionsContainerProps = {
  recipeId: string;
  comment: CosmeticRecipeComment;
  onDeleted: () => void;
};

export function ActionsContainer({
  recipeId,
  comment,
  onDeleted,
}: ActionsContainerProps) {
  const deleteCosmeticRecipeCommentMutation = useDeleteCosmeticRecipeCommentMutation(
    recipeId,
    {
      onSuccess: onDeleted,
    },
  );

  return (
    <ActionsComponent
      entity={comment}
      onDelete={() => {
        deleteCosmeticRecipeCommentMutation.mutate(comment);
      }}
      loading={{
        delete: deleteCosmeticRecipeCommentMutation.isPending,
      }}
      disabled={{
        delete: deleteCosmeticRecipeCommentMutation.isPending,
      }}
    />
  );
}
