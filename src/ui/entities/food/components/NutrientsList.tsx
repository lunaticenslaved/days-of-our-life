import { FoodNutrients, roundNutrients } from '#shared/models/food';
import _ from 'lodash';

interface FoodNutrientsListProps {
  nutrients?: FoodNutrients;
}

export function FoodNutrientsList({ nutrients }: FoodNutrientsListProps) {
  const rounded = nutrients ? roundNutrients(nutrients) : undefined;

  return (
    <ul>
      <li>Калории - {rounded?.calories || 0} ккал</li>
      <li>Белки - {rounded?.proteins || 0} г</li>
      <li>Жиры - {rounded?.fats || 0} г</li>
      <li>Углеводы - {rounded?.carbs || 0} г</li>
      <li>Клетчатка - {rounded?.fibers || 0} г</li>
    </ul>
  );
}
