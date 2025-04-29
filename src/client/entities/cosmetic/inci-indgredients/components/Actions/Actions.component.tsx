import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';

type Actions = 'edit' | 'delete';

export const ActionsComponent = createEntityActions<CosmeticINCIIngredient, Actions>({
  entityName: 'CosmeticINCIIngredient',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
