import { useListCosmeticProductsQuery } from '#/client/store';
import { ListComponent } from '../components/List';

import { ActionsContainer } from './Actions';

export function ListContainer() {
  const listCosmeticProductsQuery = useListCosmeticProductsQuery();

  return (
    <ListComponent
      entities={listCosmeticProductsQuery.data || []}
      renderActions={product => {
        return <ActionsContainer product={product} onDeleted={() => null} />;
      }}
    />
  );
}
