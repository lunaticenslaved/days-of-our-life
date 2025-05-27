export { type FoodProduct, FoodProductValidators } from './product';
export { type FoodNutrients, FoodNutrientsValidators } from './nutrients';
export { type FoodQuantityConverter, FoodQuantityConverterValidators } from './quantity';

export * as ProductComplex from './product-complex';

// ---- OLD ----------
import { FoodProduct } from './product';
import { FoodNutrients } from './nutrients';
import { FoodQuantityConverter } from './quantity';
import { CommonValidators } from '#/shared/models/common';
import { DateFormat } from '#/shared/models/date';
import { ERROR_MESSAGES } from '#/shared/validation';
import _ from 'lodash';
import { z } from 'zod';

export interface FoodRecipeOutput {
  grams: number;
  servings: number;
}

export interface FoodRecipeIngredient {
  grams: number;
  description?: string;
  product: Pick<FoodProduct, 'id' | 'manufacturer' | 'name'>;
}

export interface FoodRecipe {
  id: string;
  name: string;
  description: string;
  parts: Array<{
    title: string;
    description?: string;
    ingredients: FoodRecipeIngredient[];
  }>;
  output: FoodRecipeOutput;
  nutrientsPerGram: FoodNutrients;
  quantities: FoodQuantityConverter[];
}

export type FoodMealIngredientType = 'product' | 'recipe';

export interface FoodDay {
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
  name: z
    .string({
      message: ERROR_MESSAGES.required,
      invalid_type_error: ERROR_MESSAGES.required,
    })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255)),
  manufacturer: z
    .string({ message: ERROR_MESSAGES.required })
    .max(255, ERROR_MESSAGES.maxLengthStr(255))
    .optional(),
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
                .number({ invalid_type_error: ERROR_MESSAGES.required })
                .gte(0, ERROR_MESSAGES.gte(0)),
              description: z
                .string({ message: ERROR_MESSAGES.required })
                .max(255, ERROR_MESSAGES.maxLengthStr(255))
                .optional(),
            }),
            { message: ERROR_MESSAGES.required },
          )
          .min(1, ERROR_MESSAGES.minLengthArr(1)),
      }),
      { message: ERROR_MESSAGES.required },
    )
    .min(1, ERROR_MESSAGES.minLengthArr(1)),
};

export interface FoodDay {
  id: string;
  date: string;
  meals: Array<{ items: FoodMealItem[] }>;
  nutrients: FoodNutrients;
}

//
//
//
// --- Food Meal Item
export interface FoodMealItem {
  id: string;
  date: DateFormat;
  dayPartId: string;
  quantity: {
    value: number;
    converterId: string;
  };
  nutrients: FoodNutrients;
  food:
    | {
        type: 'product';
        productId: string;
      }
    | {
        type: 'recipe';
        recipeId: string;
      };
}

export const FoodMealItemValidators = {
  food: z
    .object({
      type: z.enum(['product']),
      productId: CommonValidators.id,
    })
    .or(
      z.object({
        type: z.enum(['recipe']),
        recipeId: CommonValidators.id,
      }),
    ),
};

//
//
//

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

export function roundNutrients(nutrients: FoodNutrients): FoodNutrients {
  const result = {} as FoodNutrients;

  for (const [keyStr, value] of Object.entries(nutrients)) {
    const key = keyStr as keyof FoodNutrients;

    result[key] = typeof value === 'number' ? _.round(value, 2) : value;
  }

  return result;
}

export const FoodNutrientsUtils = {
  isEmpty(nutrients?: FoodNutrients) {
    if (!nutrients) {
      return null;
    }

    for (const [_, value] of Object.entries(nutrients)) {
      if (typeof value === 'number' && value > 0) {
        return false;
      }
    }

    return true;
  },
};
