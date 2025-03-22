import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticProductApplication } from '#/shared/models/cosmetic';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<CosmeticProductApplication, Actions>({
  entityName: 'CosmeticProductApplication',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
