import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticRecipe } from '#/shared/models/cosmetic';

type Actions = 'add-coment' | 'edit' | 'delete';

export const CosmeticRecipesActions = createEntityActions<CosmeticRecipe, Actions>({
  entityName: 'CosmeticRecipe',
  actions: {
    'add-coment': {
      text: 'Добавить комментарий',
    },
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
  },
  getActions() {
    return ['edit', 'delete'];
  },
});
