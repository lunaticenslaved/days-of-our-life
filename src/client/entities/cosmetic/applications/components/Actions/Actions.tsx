import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';

type Actions = 'delete';

export const ActionsComponent = createEntityActions<CosmeticApplication, Actions>({
  entityName: 'CosmeticApplication',
  actions: {
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['delete'];
  },
});
