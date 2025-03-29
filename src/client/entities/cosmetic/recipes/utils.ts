import { CosmeticRecipe } from '#/shared/models/cosmetic';

export function getCosmeticRecipeKeywords(recipe: CosmeticRecipe): string[] {
  return [recipe.name];
}
