import { ERROR_MESSAGES } from '#shared/validation';
import { z } from 'zod';

export const CosmeticProductFieldValidators = {
  name: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255)),
  manufacturer: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255)),
  coreIngredients: z.string().optional(),
};

export interface CosmeticProduct {
  id: string;
  name: string;
  manufacturer: string;
  coreIngredients?: string;
}
