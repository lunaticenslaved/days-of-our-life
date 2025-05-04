import { FoodValidators } from '#/shared/models/food';
import { z } from 'zod';

export const schema = z.object({
  name: FoodValidators.name,
  description: FoodValidators.recipeDescription,
  output: FoodValidators.recipeOutput,
  parts: FoodValidators.recipeParts,
});

export type FormValues = z.infer<typeof schema>;
