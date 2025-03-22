import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticIngredient } from '#/shared/models/cosmetic';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<CosmeticIngredient, Actions>({
  entityName: 'CosmeticIngredient',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
