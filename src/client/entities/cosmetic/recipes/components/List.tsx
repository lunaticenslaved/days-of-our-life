import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticRecipe } from '#/shared/models/cosmetic';

import { getCosmeticRecipeKeywords } from '../utils';

export const ListComponent = createEntityList<CosmeticRecipe>({
  entityName: 'CosmeticRecipe',
  placeholder: {
    empty: 'Нет рецептов',
  },
  getEntityKeywords: getCosmeticRecipeKeywords,
  getEntityKey(recipe) {
    return recipe.id;
  },
  renderEntity(recipe) {
    return recipe.name;
  },
});
