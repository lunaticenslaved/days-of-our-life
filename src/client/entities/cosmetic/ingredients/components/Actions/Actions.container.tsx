import { ActionsComponent } from './Actions.component';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useDeleteCosmeticIngredientMutation } from '../../store';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

type ActionsProps = {
  ingredientId: string;
  onDeleted: () => void;
};

export function Actions({ onDeleted, ingredientId }: ActionsProps) {
  const cosmeticNavigation = useCosmeticNavigation();
  const cache = useCosmeticCacheStrict();

  const deleteCosmeticIngredientMutation = useDeleteCosmeticIngredientMutation(
    ingredientId,
    {
      onMutate: onDeleted,
    },
  );

  return (
    <ActionsComponent
      entity={cache.ingredients.get(ingredientId)}
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
