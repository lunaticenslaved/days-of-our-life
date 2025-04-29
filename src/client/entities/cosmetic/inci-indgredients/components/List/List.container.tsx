import { useListCosmeticINCIIngredientsQuery } from '../../store';
import { ListComponent } from './List.component';

import { CosmeticINCIIngredientActions } from '../Actions';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import _ from 'lodash';

export function ListContainer() {
  useListCosmeticINCIIngredientsQuery();

  const cache = useCosmeticCacheStrict();
  const ingredients = _.orderBy(
    cache.inciIngredients.list(),
    item => item.name.toLocaleLowerCase(),
    'asc',
  );

  return (
    <ListComponent
      ingredients={ingredients}
      renderActions={ingredient => {
        return (
          <CosmeticINCIIngredientActions
            ingredientId={ingredient.id}
            onDeleted={() => null}
          />
        );
      }}
    />
  );
}
