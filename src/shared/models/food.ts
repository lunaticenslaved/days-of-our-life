import { CommonValidators } from '#shared/models/common';
import { ERROR_MESSAGES } from '#shared/validation';
import { z } from 'zod';

export interface FoodProduct {
  id: string;
  name: string;
  manufacturer?: string | null;
  nutrientsPerGram: FoodNutrients;
  quantities: FoodQuantityConverter[];
}

export interface FoodNutrients {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fibers: number;
}

export interface FoodQuantityConverter {
  id: string;
  name: string;
  grams: number;
}

export interface FoodRecipeOutput {
  grams: number;
  servings: number;
}

export interface FoodRecipeIngredient {
  id: string;
  grams: number;
  description?: string;
  product: Pick<FoodProduct, 'id' | 'manufacturer' | 'name'>;
}

export interface FoodRecipe {
  id: string;
  name: string;
  description: string;
  parts: Array<{
    id: string;
    title: string;
    description?: string;
    ingredients: FoodRecipeIngredient[];
  }>;
  output: FoodRecipeOutput;
  nutrientsPerGram: FoodNutrients;
  quantities: FoodQuantityConverter[];
}

export type FoodMealIngredientType = 'product' | 'recipe';

export interface FoodTrackerDay {
  id: string;
  date: string;
}

const nutrientsValidator = z.object({
  calories: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  proteins: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  fats: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  carbs: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  fibers: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
});

const gramsValidator = z
  .number({ message: ERROR_MESSAGES.required })
  .gt(0, ERROR_MESSAGES.gt(0));
const servingsValidator = z
  .number({ message: ERROR_MESSAGES.required })
  .gt(0, ERROR_MESSAGES.gt(0));

const quantityValidator = z.coerce
  .number({ message: ERROR_MESSAGES.required })
  .gt(0, ERROR_MESSAGES.gt(0));

export const FoodValidators = {
  name: CommonValidators.str(255),
  manufacturer: CommonValidators.str(255).optional(),
  nutrients: nutrientsValidator,
  nutrientsArr: z.array(nutrientsValidator),
  quantityConverterId: CommonValidators.id,
  quantity: quantityValidator,
  grams: gramsValidator,
  servings: servingsValidator,
  mealItemSource: z.union([
    z.literal('product' satisfies FoodMealIngredientType),
    z.literal('recipe' satisfies FoodMealIngredientType),
  ]),

  recipeDescription: CommonValidators.str(4096),
  recipeOutput: z.object({
    grams: gramsValidator,
    servings: servingsValidator,
  }),
  recipeParts: z
    .array(
      z.object({
        title: CommonValidators.str(255),
        description: z
          .string({ message: ERROR_MESSAGES.required })
          .min(0, ERROR_MESSAGES.minLengthStr(0))
          .max(255, ERROR_MESSAGES.maxLengthStr(255))
          .optional(),
        ingredients: z
          .array(
            z.object({
              productId: CommonValidators.id,
              grams: z
                .number({ message: ERROR_MESSAGES.required })
                .gte(0, ERROR_MESSAGES.gte(0)),
              description: CommonValidators.str(255),
            }),
            { message: ERROR_MESSAGES.required },
          )
          .min(1, ERROR_MESSAGES.minLengthArr(1)),
      }),
      { message: ERROR_MESSAGES.required },
    )
    .min(1, ERROR_MESSAGES.minLengthArr(1)),
};

export interface FoodTrackerDay {
  id: string;
  date: string;
  meals: Array<{ items: FoodTrackerMealItem[] }>;
}

export interface FoodTrackerMealItem {
  id: string;
  quantity: number;
  quantityConverter: FoodQuantityConverter;
  nutrients: FoodNutrients;
  ingredient:
    | {
        type: 'product';
        product: Pick<FoodProduct, 'id' | 'name' | 'manufacturer'>;
      }
    | {
        type: 'recipe';
        recipe: Pick<FoodRecipe, 'id' | 'name'>;
      };
}

export function sumNutrients(nutrientsArr: FoodNutrients[]): FoodNutrients {
  const result = {} as FoodNutrients;

  for (const nutrients of nutrientsArr) {
    for (const [keyStr, value] of Object.entries(nutrients)) {
      const key = keyStr as keyof FoodNutrients;

      if (!(key in result)) {
        result[key] = 0;
      }

      result[key] += value;
    }
  }

  return result;
}

export function multiplyNutrients(
  nutrients: FoodNutrients,
  multiplier: number,
): FoodNutrients {
  const result = {} as FoodNutrients;

  for (const [keyStr, value] of Object.entries(nutrients)) {
    const key = keyStr as keyof FoodNutrients;

    if (!(key in result)) {
      result[key] = 0;
    }

    result[key] = value * multiplier;
  }

  return result;
}

export function divideNutrients(nutrients: FoodNutrients, divider: number) {
  return {
    calories: nutrients.calories / divider,
    fats: nutrients.fats / divider,
    proteins: nutrients.proteins / divider,
    carbs: nutrients.carbs / divider,
    fibers: nutrients.fibers / divider,
  };
}
