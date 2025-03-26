import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<CosmeticApplication, Actions>({
  entityName: 'CosmeticApplication',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
