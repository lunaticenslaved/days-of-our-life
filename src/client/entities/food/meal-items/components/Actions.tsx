import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { FoodMealItem } from '#/shared/models/food';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<FoodMealItem, Actions>({
  entityName: 'FoodMealItem',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
