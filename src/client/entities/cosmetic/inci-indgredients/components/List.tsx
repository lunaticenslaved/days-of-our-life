import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';

export const CosmeticINCIIngredientsList = createEntityList<CosmeticINCIIngredient>({
  entityName: 'CosmeticINCIIngredient',
  placeholder: {
    empty: 'Нет INCI-ингредиентов',
  },
  getEntityKey(ingredient) {
    return ingredient.id;
  },
  renderEntity(ingredient) {
    return ingredient.name;
  },
});
