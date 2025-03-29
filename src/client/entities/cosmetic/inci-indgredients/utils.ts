import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';

export function getCosmeticINCIIngreientKeywords(
  ingredient: CosmeticINCIIngredient,
): string[] {
  return [ingredient.name];
}
