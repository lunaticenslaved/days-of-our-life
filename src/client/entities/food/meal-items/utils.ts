import {
  FoodMealItem,
  FoodNutrients,
  FoodProduct,
  FoodQuantityConverter,
  FoodRecipe,
  multiplyNutrients,
} from '#/shared/models/food';
import { nonReachable } from '#/shared/utils';

export function findNutrientsPerGram(
  { food }: Pick<FoodMealItem, 'food'>,
  arg: {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  },
): FoodNutrients | undefined {
  if (food.type === 'product') {
    const product = arg.products.find(p => p.id === food.productId);

    return product?.nutrientsPerGram;
  } else if (food.type === 'recipe') {
    const recipe = arg.recipes.find(p => p.id === food.recipeId);

    return recipe?.nutrientsPerGram;
  } else {
    nonReachable(food);
  }
}

export function findFoodName(
  { food }: Pick<FoodMealItem, 'food'>,
  arg: {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  },
): string | undefined {
  if (food.type === 'product') {
    const product = arg.products.find(p => p.id === food.productId);

    return product?.name;
  } else if (food.type === 'recipe') {
    const recipe = arg.recipes.find(p => p.id === food.recipeId);

    return recipe?.name;
  } else {
    nonReachable(food);
  }
}

export function findQuantities(
  mealItem: Pick<FoodMealItem, 'food'>,
  arg: {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  },
): FoodQuantityConverter[] | undefined {
  const { food } = mealItem;

  if (food.type === 'product') {
    const product = arg.products.find(p => p.id === food.productId);

    return product?.quantities;
  } else if (food.type === 'recipe') {
    const recipe = arg.recipes.find(p => p.id === food.recipeId);

    return recipe?.quantities;
  } else {
    nonReachable(food);
  }
}

export function findQuantityConverter(
  mealItem: Pick<FoodMealItem, 'quantity' | 'food'>,
  arg: {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  },
): FoodQuantityConverter | undefined {
  const quantities = findQuantities(mealItem, arg);

  return quantities?.find(q => q.id === mealItem.quantity.converterId);
}

export function findNutrients(
  mealItem: Pick<FoodMealItem, 'quantity' | 'food'>,
  arg: {
    products: FoodProduct[];
    recipes: FoodRecipe[];
  },
) {
  const nutrientsPerGram = findNutrientsPerGram(mealItem, arg);
  const quantityConverter = findQuantityConverter(mealItem, arg);

  return nutrientsPerGram && quantityConverter
    ? multiplyNutrients(
        nutrientsPerGram,
        quantityConverter.grams * mealItem.quantity.value,
      )
    : undefined;
}
