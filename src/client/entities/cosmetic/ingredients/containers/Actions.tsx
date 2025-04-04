import { ActionsComponent } from '../components/Actions';
import { useDeleteCosmeticIngredientMutation } from '#/client/store';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';

type ActionsProps = {
  ingredient: CosmeticIngredient;
  onDeleted: () => void;
};

export function Actions({ onDeleted, ...props }: ActionsProps) {
  const cosmeticNavigation = useCosmeticNavigation();

  const deleteCosmeticIngredientMutation = useDeleteCosmeticIngredientMutation({
    onMutate: onDeleted,
  });

  return (
    <ActionsComponent
      entity={props.ingredient}
      onDelete={ingredient => {
        deleteCosmeticIngredientMutation.mutate(ingredient);
      }}
      onEdit={ingredient => {
        cosmeticNavigation.toIngredientEdit({ ingredientId: ingredient.id });
      }}
      disabled={{
        edit: false,
        delete: deleteCosmeticIngredientMutation.isPending,
      }}
      loading={{
        edit: false,
        delete: deleteCosmeticIngredientMutation.isPending,
      }}
    />
  );
}
