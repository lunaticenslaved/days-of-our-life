import { createEntityList } from '#/client/component-factories/EntityList';
import {
  findFoodName,
  findQuantityConverter,
} from '#/client/entities/food/meal-items/utils';
import { FoodNutrientsList } from '#/client/entities/food/nutrients/components/NutrientsList';
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
    const name = findFoodName(mealItem, props) || '-';
    const quantityConverter = findQuantityConverter(mealItem, props);

    return (
      <div>
        <div>{name}</div>
        <div>
          {quantityConverter?.name || '-'} - {mealItem.quantity.value}
        </div>
        <FoodNutrientsList nutrients={mealItem.nutrients} />
      </div>
    );
  },
});
