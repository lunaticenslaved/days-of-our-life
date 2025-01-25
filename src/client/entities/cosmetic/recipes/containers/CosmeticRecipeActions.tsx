import { Button } from '#/client/components/Button';
import { ConfirmDialog } from '#/client/components/ConfirmDialog';
import { useDialog } from '#/client/components/Dialog';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useDeleteCosmeticRecipeMutation } from '#/client/store';
import { CosmeticRecipe } from '#/shared/models/cosmetic';

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

      <Button onClick={() => cosmeticNavigation.toRecipeEdit({ recipeId: recipe.id })}>
        Редактировать
      </Button>
      <Button
        onClick={deletingConfirmDialog.open}
        disabled={deleteRecipeMutation.isPending}>
        Удалить
      </Button>
    </div>
  );
}
