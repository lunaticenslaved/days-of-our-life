import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { getCosmeticINCIIngreientKeywords } from '../utils';

export const ListComponent = createEntityList<CosmeticINCIIngredient>({
  entityName: 'CosmeticINCIIngredient',
  placeholder: {
    empty: 'Нет INCI-ингредиентов',
  },
  getEntityKeywords: getCosmeticINCIIngreientKeywords,
  getEntityKey(ingredient) {
    return ingredient.id;
  },
  renderEntity(ingredient) {
    return ingredient.name;
  },
});
