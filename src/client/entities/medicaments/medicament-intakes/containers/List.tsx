import { MedicamentIntake } from '#/shared/models/medicament';
import { ListComponent } from '../components/List';

import { ActionsContainer } from './Actions';

export function ListContainer({ intakes }: { intakes: MedicamentIntake[] }) {
  return (
    <ListComponent
      entities={intakes}
      renderActions={intake => {
        return <ActionsContainer intake={intake} onDeleted={() => null} />;
      }}
    />
  );
}
