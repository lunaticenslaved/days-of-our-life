import { CosmeticRecipe } from '#/shared/models/cosmetic';

export function getCosmeticRecipeKeywords(
  recipe: Pick<CosmeticRecipe, 'name'>,
): string[] {
  return [recipe.name];
}
