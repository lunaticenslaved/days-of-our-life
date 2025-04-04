import { createEntityList } from '#/client/component-factories/EntityList';
import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { Button } from '#/ui-lib/atoms/Button';

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
    return (
      <Button
        component="router-link"
        view="clear"
        to={COSMETIC_NAVIGATION.toIngredientOverview({ ingredientId: ingredient.id })}>
        {ingredient.name}
      </Button>
    );
  },
});
