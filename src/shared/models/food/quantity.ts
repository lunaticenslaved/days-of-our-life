import { CommonValidators } from '#/shared/models/common';
import { ERROR_MESSAGES } from '#/shared/validation';
import { z } from 'zod';

export interface FoodQuantityConverter {
  id: string;
  name: string;
  grams: number;
}

export const FoodQuantityConverterValidators = {
  id: CommonValidators.id,
  name: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255)),
  grams: z
    .number({ message: ERROR_MESSAGES.required })
    .min(0.01, ERROR_MESSAGES.gte(0.01)),
};
