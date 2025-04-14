import { useListCosmeticINCIIngredientsQuery } from '#/client/store';
import { ListComponent } from '../components/List';

import { ActionsContainer } from './Actions';

export function ListContainer() {
  const listQuery = useListCosmeticINCIIngredientsQuery();

  return (
    <ListComponent
      ingredients={listQuery.data || []}
      renderActions={ingredient => {
        return <ActionsContainer ingredient={ingredient} onDeleted={() => null} />;
      }}
    />
  );
}
