import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import { CosmeticBenefit } from '#/shared/models/cosmetic';

type Actions = 'edit' | 'delete' | 'create-subcategory';

export const ActionsComponent = createEntityActions<CosmeticBenefit, Actions>({
  entityName: 'CosmeticBenefit',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
    'create-subcategory': {
      text: 'Добавить подкатегорию',
    },
  },
  getActions() {
    return ['edit', 'create-subcategory', 'delete'];
  },
});
