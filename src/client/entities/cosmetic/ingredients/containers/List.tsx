import { ComboboxComponent } from '../components/Combobox';
import { useListCosmeticIngredientsQuery } from '#/client/store';
import { List as ListComponent } from '../components/List';

import { Actions } from './Actions';

export function List() {
  const listCosmeticIngredientQuery = useListCosmeticIngredientsQuery();

  return (
    <>
      <ComboboxComponent />
      <ListComponent
        entities={listCosmeticIngredientQuery.data || []}
        renderActions={ingredient => {
          return <Actions ingredient={ingredient} onDeleted={() => null} />;
        }}
      />
    </>
  );
}
