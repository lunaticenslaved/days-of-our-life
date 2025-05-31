import { FoodRecipe } from '#/shared/models/food';

export function getFoodRecipeKeywords(
  recipe: Required<Pick<FoodRecipe, 'name'>> & Partial<Pick<FoodRecipe, 'description'>>,
) {
  const arr = [recipe.name];

  if (recipe.description) {
    arr.push(recipe.description);
  }

  return arr;
}
