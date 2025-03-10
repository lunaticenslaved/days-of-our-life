import { Button } from '#/ui-lib/atoms/Button';
import { ConfirmDialog } from '#/client/components/ConfirmDialog';
import { CosmeticRecipeCommentFormDialog } from '../../recipe-comments/containers/CosmeticRecipeCommentFormDialog';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useDeleteCosmeticRecipeMutation } from '#/client/store';
import { CosmeticRecipe } from '#/shared/models/cosmetic';
import { useDialog } from '#/ui-lib/atoms/Dialog';

interface CosmeticRecipeActionsProps {
  recipe: CosmeticRecipe;
  onDeleted(): void;
}

export function CosmeticRecipeActions({ recipe, onDeleted }: CosmeticRecipeActionsProps) {
  const cosmeticNavigation = useCosmeticNavigation();

  const deleteRecipeMutation = useDeleteCosmeticRecipeMutation({
    onSuccess: onDeleted,
  });

  const deletingConfirmDialog = useDialog();
  const commentDialog = useDialog();

  return (
    <div style={{ display: 'flex' }}>
      <ConfirmDialog
        dialog={deletingConfirmDialog}
        onCancel={deletingConfirmDialog.close}
        title="Удалить рецепт?"
        text="Рецепт будет удалён без возможности восстановления"
        submitText="Удалить"
        onSubmit={() => {
          deleteRecipeMutation.mutate(recipe);
        }}
      />

      <CosmeticRecipeCommentFormDialog dialog={commentDialog} recipeId={recipe.id} />

      <Button onClick={() => cosmeticNavigation.toRecipeEdit({ recipeId: recipe.id })}>
        Редактировать
      </Button>

      <Button
        onClick={deletingConfirmDialog.open}
        disabled={deleteRecipeMutation.isPending}>
        Удалить
      </Button>

      <Button onClick={commentDialog.open}>Добавить комментарий</Button>
    </div>
  );
}
