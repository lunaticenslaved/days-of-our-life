import { useDeleteCosmeticRecipeMutation } from '#/client/entities/cosmetic/recipes';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { CosmeticRecipe } from '#/shared/models/cosmetic';
import { useDialog } from '#/ui-lib/components/atoms/Dialog';

import { CosmeticRecipesActions as ActionsComponent } from '../components/Actions';

interface CosmeticRecipeActionsProps {
  recipe: CosmeticRecipe;
  onDeleted(): void;
}

export function CosmeticRecipeActions({ recipe, onDeleted }: CosmeticRecipeActionsProps) {
  const cosmeticNavigation = useCosmeticNavigation();

  const deleteRecipeMutation = useDeleteCosmeticRecipeMutation(recipe.id, {
    onSuccess: onDeleted,
  });

  const commentDialog = useDialog();

  return (
    <ActionsComponent
      entity={recipe}
      disabled={{
        delete: deleteRecipeMutation.isPending,
        edit: false, // TODO use state from mutation
        'add-coment': false, // TODO use state from mutation
      }}
      loading={{
        delete: deleteRecipeMutation.isPending,
        edit: false,
        'add-coment': false,
      }}
      onEdit={() => {
        cosmeticNavigation.toRecipeEdit({ recipeId: recipe.id });
      }}
      onDelete={() => {
        deleteRecipeMutation.mutate(recipe);
      }}
      onAddComent={() => {
        commentDialog.open();
      }}
    />
  );
}
