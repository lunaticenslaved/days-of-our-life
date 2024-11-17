import { FoodNutrients, roundNutrients } from '#shared/models/food';
import _ from 'lodash';

interface FoodNutrientsListProps {
  nutrients: FoodNutrients;
}

export function FoodNutrientsList({ nutrients }: FoodNutrientsListProps) {
  const rounded = roundNutrients(nutrients);

  return (
    <ul>
      <li>Калории - {rounded.calories} ккал</li>
      <li>Белки - {rounded.proteins} г</li>
      <li>Жиры - {rounded.fats} г</li>
      <li>Углеводы - {rounded.carbs} г</li>
      <li>Клетчатка - {rounded.fibers} г</li>
    </ul>
  );
}
