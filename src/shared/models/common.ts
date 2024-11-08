import { ERROR_MESSAGES } from '#shared/validation';
import { z } from 'zod';

export const Validators = {
  id: z
    .string({ message: ERROR_MESSAGES.required })
    .uuid({ message: ERROR_MESSAGES.required }),
  name: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255)),
  title: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(255, ERROR_MESSAGES.maxLengthStr(255)),
  description: z
    .string({ message: ERROR_MESSAGES.required })
    .min(1, ERROR_MESSAGES.minLengthStr(1))
    .max(4096, ERROR_MESSAGES.maxLengthStr(4096)),
  calories: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  proteins: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  fats: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  carbs: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  grams: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
  fibers: z.number({ message: ERROR_MESSAGES.required }).gte(0, ERROR_MESSAGES.gte(0)),
};
