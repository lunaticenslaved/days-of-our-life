import { ActionsContainer } from './Actions';
import { useListCosmeticBenefitsQuery } from '#/client/store';
import { ListComponent } from '../components/List';

export function ListContainer() {
  const listCosmeticBenefitsQuery = useListCosmeticBenefitsQuery();

  return (
    <ListComponent
      benefits={listCosmeticBenefitsQuery.data || []}
      renderActions={benefit => {
        return <ActionsContainer benefit={benefit} onDeleted={() => null} />;
      }}
    />
  );
}
