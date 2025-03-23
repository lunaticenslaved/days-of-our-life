import { useListMedicamentsQuery } from '#/client/store/medicaments';
import { ListComponent } from '../components/List';

import { ActionsContainer } from './Actions';

export function ListContainer() {
  const listMedicamentsQuery = useListMedicamentsQuery();

  return (
    <ListComponent
      entities={listMedicamentsQuery.data || []}
      renderActions={medicament => {
        return <ActionsContainer medicament={medicament} onDeleted={() => null} />;
      }}
    />
  );
}
