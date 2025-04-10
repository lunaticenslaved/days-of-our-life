import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { getCosmeticINCIIngredientKeywords } from '../utils';

export const ListComponent = createEntityList<CosmeticINCIIngredient>({
  entityName: 'CosmeticINCIIngredient',
  placeholder: {
    empty: 'Нет INCI-ингредиентов',
  },
  getEntityKeywords: getCosmeticINCIIngredientKeywords,
  getEntityKey(ingredient) {
    return ingredient.id;
  },
  renderEntity(ingredient) {
    return ingredient.name;
  },
});
