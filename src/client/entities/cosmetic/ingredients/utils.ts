import { CosmeticIngredient } from '#/shared/models/cosmetic';
import _ from 'lodash';

export function getCosmeticIngredientKeywords(ingredient: CosmeticIngredient): string[] {
  return [ingredient.name];
}

export function orderCosmeticIngredients(
  items: CosmeticIngredient[],
): CosmeticIngredient[] {
  return _.orderBy(items, item => item.name, 'asc');
}
