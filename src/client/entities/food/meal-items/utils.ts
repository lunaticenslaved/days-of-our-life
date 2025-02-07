import {
  FoodMealItem,
  FoodNutrients,
  FoodProduct,
  FoodRecipe,
} from '#/shared/models/food';
import { assertDefined, nonReachable } from '#/shared/utils';

export function getNutrientsPerGram(
  { food }: Pick<FoodMealItem, 'food'>,
  arg: {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  },
): FoodNutrients {
  if (food.type === 'product') {
    const product = arg.products.find(p => p.id === food.productId);

    assertDefined(product);

    return product.nutrientsPerGram;
  } else if (food.type === 'recipe') {
    const recipe = arg.recipes.find(p => p.id === food.recipeId);

    assertDefined(recipe);

    return recipe.nutrientsPerGram;
  } else {
    nonReachable(food);
  }
}

export function getFoodName(
  { food }: Pick<FoodMealItem, 'food'>,
  arg: {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  },
) {
  if (food.type === 'product') {
    const product = arg.products.find(p => p.id === food.productId);

    assertDefined(product);

    return product.name;
  } else if (food.type === 'recipe') {
    const recipe = arg.recipes.find(p => p.id === food.recipeId);

    assertDefined(recipe);

    return recipe.name;
  } else {
    nonReachable(food);
  }
}
