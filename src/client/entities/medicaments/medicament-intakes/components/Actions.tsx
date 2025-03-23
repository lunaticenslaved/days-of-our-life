import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { MedicamentIntake } from '#/shared/models/medicament';

type Actions = 'delete';

export const ActionsComponent = createEntityActions<MedicamentIntake, Actions>({
  entityName: 'MedicamentIntake',
  actions: {
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['delete'];
  },
});
