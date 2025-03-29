import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticIngredient } from '#/shared/models/cosmetic';

import { getCosmeticIngredientKeywords } from '../utils';

export const List = createEntityList<CosmeticIngredient>({
  entityName: 'CosmeticIngredient',
  placeholder: {
    empty: 'Нет ингредиентов',
  },
  getEntityKeywords: getCosmeticIngredientKeywords,
  getEntityKey(ingredient) {
    return ingredient.id;
  },
  renderEntity(ingredient) {
    return ingredient.name;
  },
});
