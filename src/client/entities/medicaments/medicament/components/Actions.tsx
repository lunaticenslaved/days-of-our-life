import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { Medicament } from '#/shared/models/medicament';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<Medicament, Actions>({
  entityName: 'Medicament',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
