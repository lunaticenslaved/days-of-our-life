import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticRecipeComment } from '#/shared/models/cosmetic';

type Actions = 'delete';

export const ActionsComponent = createEntityActions<CosmeticRecipeComment, Actions>({
  entityName: 'CosmeticRecipeComment',
  actions: {
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['delete'];
  },
});
