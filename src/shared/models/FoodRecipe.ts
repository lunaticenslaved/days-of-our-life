import { ERROR_MESSAGES } from '#shared/validation';
import { z } from 'zod';
import { Validators } from './common';
import { FoodProduct } from '#shared/models/FoodProduct';
import { FoodNutrients } from '#shared/models/food';

export type FoodRecipeStatsType = 'servings' | 'grams';
export interface FoodRecipeStatsInfo {
  type: FoodRecipeStatsType;
  quantity: number;
  nutrients: FoodNutrients;
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
  stats: FoodRecipeStatsInfo[];
}

export const FOOD_RECIPE_STATS_TYPES = Object.keys({
  grams: {},
  servings: {},
} satisfies Record<FoodRecipeStatsType, unknown>) as FoodRecipeStatsType[];

export const FoodRecipeValidator = z.object({
  name: Validators.name,
  description: Validators.description,
  stats: z
    .array(
      z.object({
        type: z.union([z.literal('servings'), z.literal('grams')], {
          message: ERROR_MESSAGES.oneOf(FOOD_RECIPE_STATS_TYPES),
        }),
        quantity: z
          .number({ message: ERROR_MESSAGES.required })
          .gt(0, ERROR_MESSAGES.gt(0)),
      }),
      {
        message: ERROR_MESSAGES.required,
      },
    )
    .min(1, ERROR_MESSAGES.minLengthArr(1)),
  parts: z
    .array(
      z.object({
        title: Validators.title,
        description: z
          .string({ message: ERROR_MESSAGES.required })
          .max(4096, ERROR_MESSAGES.maxLengthStr(4096))
          .optional(),
        ingredients: z
          .array(
            z.object({
              grams: Validators.grams,
              productId: Validators.id,
              description: z
                .string({ message: ERROR_MESSAGES.required })
                .max(255, ERROR_MESSAGES.maxLengthStr(255))
                .optional(),
            }),
            {
              message: ERROR_MESSAGES.required,
            },
          )
          .min(1, ERROR_MESSAGES.minLengthArr(1)),
      }),
      {
        message: ERROR_MESSAGES.required,
      },
    )
    .min(1, ERROR_MESSAGES.minLengthArr(1)),
});
