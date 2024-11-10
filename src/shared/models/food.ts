import { CommonValidators } from '#shared/models/common';
import { ERROR_MESSAGES } from '#shared/validation';
import { z } from 'zod';

export interface FoodProduct {
  id: string;
  name: string;
  manufacturer?: string | null;
  nutrientsPerGram: FoodNutrients;
}

export interface FoodNutrients {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fibers: number;
}

export type FoodQuantityType = 'serving' | 'gram';

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
}

export interface FoodTrackerDay {
  id: string;
  date: string;
}

export const FOOD_RECIPE_STATS_TYPES = Object.keys({
  gram: {},
  serving: {},
} satisfies Record<FoodQuantityType, unknown>) as FoodQuantityType[];

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

const quantityValidator = z
  .number({ message: ERROR_MESSAGES.required })
  .gt(0, ERROR_MESSAGES.gt(0));

const quantityTypeValidator = z.union(
  [
    z.literal('serving' satisfies FoodQuantityType),
    z.literal('gram' satisfies FoodQuantityType),
  ],
  { message: ERROR_MESSAGES.oneOf(FOOD_RECIPE_STATS_TYPES) },
);

export const FoodValidators = {
  name: CommonValidators.str(255),
  manufacturer: CommonValidators.str(255).optional(),
  nutrients: nutrientsValidator,
  nutrientsArr: z.array(nutrientsValidator),
  quantity: quantityValidator,
  quantityType: quantityTypeValidator,
  grams: gramsValidator,
  servings: servingsValidator,

  recipeDescription: CommonValidators.str(4096),
  recipeOutput: z.object({
    grams: gramsValidator,
    servings: servingsValidator,
  }),
  recipeParts: z
    .array(
      z.object({
        title: CommonValidators.str(255),
        description: CommonValidators.str(4096),
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
  quantityType: FoodQuantityType;
  nutrients: FoodNutrients;
  source:
    | {
        type: 'product';
        product: Pick<FoodProduct, 'id' | 'name' | 'manufacturer'>;
      }
    | {
        type: 'recipe';
        recipe: Pick<FoodRecipe, 'id' | 'name'>;
      };
}
