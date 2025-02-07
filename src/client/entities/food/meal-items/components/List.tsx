import { createEntityList } from '#/client/component-factories/EntityList';
import { getFoodName } from '#/client/entities/food/meal-items/utils';
import { FoodMealItem, FoodProduct, FoodRecipe } from '#/shared/models/food';

export const ListComponent = createEntityList<
  FoodMealItem,
  {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  }
>({
  entityName: 'FoodMealItem',
  placeholder: {
    empty: 'Нет еды',
  },
  getEntityKey(mealItem) {
    return mealItem.id;
  },
  renderEntity(mealItem, props) {
    return getFoodName(mealItem, props);
  },
});
