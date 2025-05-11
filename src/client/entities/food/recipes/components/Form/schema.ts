import { FoodValidators } from '#/shared/models/food';
import { z } from 'zod';

export const schema = z.object({
  name: FoodValidators.name,
  description: FoodValidators.recipeDescription,
  output: FoodValidators.recipeOutput,
  parts: FoodValidators.recipeParts,
  addedIngredient: z
    .object({
      partField: z.string(),
      ingredientIndex: z.number(),
    })
    .optional(),
});

export type FormValues = z.infer<typeof schema>;
