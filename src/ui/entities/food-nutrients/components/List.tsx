import { FoodNutrients } from '#shared/models/food';
import _ from 'lodash';

interface FoodNutrientsListProps {
  nutrients: FoodNutrients;
  multiplier?: number;
}

export function FoodNutrientsList({ nutrients, multiplier = 1 }: FoodNutrientsListProps) {
  const convert = (v: number) => {
    return _.round(v * multiplier, 2);
  };

  return (
    <ul>
      <li>Калории - {convert(nutrients.calories)} ккал</li>
      <li>Белки - {convert(nutrients.proteins)} г</li>
      <li>Жиры - {convert(nutrients.fats)} г</li>
      <li>Углеводы - {convert(nutrients.carbs)} г</li>
      <li>Клетчатка - {convert(nutrients.fibers)} г</li>
    </ul>
  );
}
