import { ActionsComponent } from './Actions.component';
import {
  useDeleteCosmeticINCIIngredientMutation,
  useUpdateCosmeticINCIIngredientMutation,
} from '../../store';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';

interface ActionsContainerProps {
  ingredientId: string;
  onDeleted: () => void;
}

export function ActionsContainer({ ingredientId, onDeleted }: ActionsContainerProps) {
  const cache = useCosmeticCacheStrict();

  const ingredient = cache.inciIngredients.get(ingredientId);

  const updatingMutation = useUpdateCosmeticINCIIngredientMutation(ingredientId);
  const deletingMutation = useDeleteCosmeticINCIIngredientMutation(ingredientId, {
    onMutate: onDeleted,
  });

  const navigation = useCosmeticNavigation();

  return (
    <ActionsComponent
      loading={{
        delete: deletingMutation.isPending,
        edit: updatingMutation.isPending,
      }}
      disabled={{
        delete: deletingMutation.isPending,
        edit: updatingMutation.isPending || deletingMutation.isPending,
      }}
      entity={ingredient}
      onDelete={() => {
        deletingMutation.mutate(ingredient);
      }}
      onEdit={ingredient => {
        navigation.toINCIIngredientEdit({
          inciIngredientId: ingredient.id,
        });
      }}
    />
  );
}
