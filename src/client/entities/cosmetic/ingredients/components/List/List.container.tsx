import { ListComponent } from './List.component';

import { CosmeticIngredientActions } from '../Actions';
import { useListCosmeticIngredientsQuery } from '../../store';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { useCosmeticNavigation } from '#/client/pages/cosmetic';

export function ListContainer() {
  useListCosmeticIngredientsQuery();

  const cache = useCosmeticCacheStrict();

  const ingredients = cache.ingredients.list();
  const navigation = useCosmeticNavigation();

  return (
    <ListComponent
      ingredients={ingredients}
      onItemClick={ing => navigation.toIngredientOverview({ ingredientId: ing.id })}
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
