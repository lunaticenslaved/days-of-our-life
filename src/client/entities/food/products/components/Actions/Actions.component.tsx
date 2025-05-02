import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { FoodProduct } from '#/shared/models/food';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<FoodProduct, Actions>({
  entityName: 'FoodProduct',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
