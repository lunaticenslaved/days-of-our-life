import { ListComponent } from './List.component';

import { CosmeticIngredientActions } from '../Actions';
import { useListCosmeticIngredientsQuery } from '../../store';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

export function ListContainer() {
  useListCosmeticIngredientsQuery();

  const cache = useCosmeticCacheStrict();

  const ingredients = cache.ingredients.list();

  return (
    <ListComponent
      ingredients={ingredients}
      renderActions={ingredient => {
        return (
          <CosmeticIngredientActions
            ingredientId={ingredient.id}
            onDeleted={() => null}
          />
        );
      }}
    />
  );
}
