import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticProduct } from '#/shared/models/cosmetic';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<CosmeticProduct, Actions>({
  entityName: 'CosmeticProduct',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
