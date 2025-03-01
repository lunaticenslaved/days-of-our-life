import { CommonValidators } from '#/shared/models/common';
import { z } from 'zod';
import { FoodNutrients, FoodNutrientsValidators } from './nutrients';
import { FoodQuantityConverter, FoodQuantityConverterValidators } from './quantity';
import { ERROR_MESSAGES } from '#/shared/validation';

export interface FoodProduct {
  id: string;
  name: string;
  manufacturer?: string | null;
  nutrientsPerGram: FoodNutrients;
  quantities: FoodQuantityConverter[];
}

export const FoodProductValidators = {
  id: CommonValidators.id,
  name: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255)),
  manufacturer: z.string().max(255, ERROR_MESSAGES.maxLengthStr(255)).nullable(),
  nutrientsPerGram: z.object(FoodNutrientsValidators),
  quantities: z
    .array(z.object(FoodQuantityConverterValidators))
    .min(1, ERROR_MESSAGES.minLengthArr(1)),
};
