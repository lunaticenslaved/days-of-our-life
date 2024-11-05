import { Validators } from '#shared/models/common';
import { FoodNutrients } from '#shared/models/food';
import { ERROR_MESSAGES } from '#shared/validation';
import { z } from 'zod';

export const FoodProductFieldValidators = {
  manufacturer: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255))
    .optional(),

  name: Validators.name,
  calories: Validators.calories,
  proteins: Validators.proteins,
  fats: Validators.fats,
  carbs: Validators.carbs,
};

export interface FoodProduct {
  id: string;
  name: string;
  manufacturer?: string;
  nutrients: FoodNutrients;
}
