import { CosmeticIngredient } from '#/shared/models/cosmetic';

export function getCosmeticIngredientKeywords(ingredient: CosmeticIngredient): string[] {
  return [ingredient.name];
}
