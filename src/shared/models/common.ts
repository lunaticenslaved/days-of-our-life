import { DateFormat } from '#/shared/models/date';
import { ERROR_MESSAGES } from '#shared/validation';
import { z, ZodStringDef } from 'zod';

export const CommonValidators = {
  id: z
    .string({ message: ERROR_MESSAGES.required })
    .uuid({ message: ERROR_MESSAGES.required }),
  str: (length: number) =>
    z
      .string({ message: ERROR_MESSAGES.required })
      .min(1, ERROR_MESSAGES.minLengthStr(1))
      .max(length, ERROR_MESSAGES.maxLengthStr(length)),
  date: z
    .string({ message: ERROR_MESSAGES.required })
    .datetime({ message: ERROR_MESSAGES.required }),
  dateFormat: z
    .string()
    .regex(/\d{2}-\d{2}-\d{4}/, { message: 'Invalid date format' }) as z.ZodType<
    DateFormat,
    ZodStringDef
  >,
};

export type SortOrder = 'asc' | 'desc';
