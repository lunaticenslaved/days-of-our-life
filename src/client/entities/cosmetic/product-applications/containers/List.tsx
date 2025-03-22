import { CosmeticProductApplication } from '#/shared/models/cosmetic';
import { ListComponent } from '../components/List';

import { ActionsContainer } from './Actions';

type ListContainerProps = {
  applications: CosmeticProductApplication[];
};

export function ListContainer({ applications }: ListContainerProps) {
  return (
    <ListComponent
      entities={applications}
      renderActions={application => {
        return <ActionsContainer application={application} onDeleted={() => null} />;
      }}
    />
  );
}
