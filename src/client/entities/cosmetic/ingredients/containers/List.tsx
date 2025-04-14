import { useListCosmeticIngredientsQuery } from '#/client/store';
import { ListComponent } from '../components/List';

import { Actions } from './Actions';

export function List() {
  const listCosmeticIngredientQuery = useListCosmeticIngredientsQuery();

  return (
    <>
      <ListComponent
        ingredients={listCosmeticIngredientQuery.data || []}
        renderActions={ingredient => {
          return <Actions ingredient={ingredient} onDeleted={() => null} />;
        }}
      />
    </>
  );
}
