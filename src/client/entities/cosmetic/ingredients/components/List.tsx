import { createEntityList } from '#/client/component-factories/EntityList';
import { CosmeticIngredient } from '#/shared/models/cosmetic';

export const List = createEntityList<CosmeticIngredient>({
  entityName: 'CosmeticIngredient',
  placeholder: {
    empty: 'Нет ингредиентов',
  },
  getEntityKey(ingredient) {
    return ingredient.id;
  },
  renderEntity(ingredient) {
    return ingredient.name;
  },
});
