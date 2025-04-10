import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';

export function getCosmeticINCIIngredientKeywords(
  ingredient: CosmeticINCIIngredient,
): string[] {
  return [ingredient.name];
}
