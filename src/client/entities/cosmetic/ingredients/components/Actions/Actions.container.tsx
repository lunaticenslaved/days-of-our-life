import { ActionsComponent } from './Actions.component';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import {
  useDeleteCosmeticIngredientMutation,
  useUpdateCosmeticIngredientMutation,
} from '../../store';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

type ActionsProps = {
  ingredientId: string;
  onDeleted: () => void;
};

export function Actions({ onDeleted, ingredientId }: ActionsProps) {
  const cosmeticNavigation = useCosmeticNavigation();
  const cache = useCosmeticCacheStrict();

  const deleting = useDeleteCosmeticIngredientMutation(ingredientId, {
    onMutate: onDeleted,
  });
  const updating = useUpdateCosmeticIngredientMutation(ingredientId, {
    onMutate: onDeleted,
  });

  return (
    <ActionsComponent
      entity={cache.ingredients.get(ingredientId)}
      onDelete={ingredient => {
        deleting.mutate(ingredient);
      }}
      onEdit={ingredient => {
        cosmeticNavigation.toIngredientEdit({ ingredientId: ingredient.id });
      }}
      disabled={{
        edit: deleting.isPending,
        delete: deleting.isPending,
      }}
      loading={{
        edit: updating.isPending,
        delete: deleting.isPending,
      }}
    />
  );
}
