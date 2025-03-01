import { ERROR_MESSAGES } from '#/shared/validation';
import { z } from 'zod';

export interface FoodNutrients {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fibers: number;
}

export const FoodNutrientsValidators = {
  calories: z
    .number({ message: ERROR_MESSAGES.required })
    .min(0, 'Калорий не может быть меньше 0'),
  proteins: z
    .number({ message: ERROR_MESSAGES.required })
    .min(0, 'Белков не может быть меньше 0'),
  fats: z
    .number({ message: ERROR_MESSAGES.required })
    .min(0, 'Жиров не может быть меньше 0'),
  carbs: z
    .number({ message: ERROR_MESSAGES.required })
    .min(0, 'Углеводов не может быть меньше 0'),
  fibers: z
    .number({ message: ERROR_MESSAGES.required })
    .min(0, 'Клетчатки не может быть меньше 0'),
};
