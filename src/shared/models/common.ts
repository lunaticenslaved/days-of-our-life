import dayjs from '#shared/libs/dayjs';
import { ERROR_MESSAGES } from '#shared/validation';
import { Dayjs } from 'dayjs';
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

export type DateFormat = `${number}-${number}-${number}`;

export function toDateFormat(date: string | Date | Dayjs) {
  return dayjs(date)
    .startOf('day')
    .format('DD-MM-YYYY') as `${number}-${number}-${number}`;
}

export function fromDateFormat(date: `${number}-${number}-${number}`) {
  const offsetMinutes = dayjs().utcOffset();

  return dayjs(date, 'DD-MM-YYYY').startOf('day').add(offsetMinutes, 'minute').toDate();
}

type ValidDateData = DateFormat | Date;

function getDayjsObject(date: ValidDateData) {
  if (date instanceof Date) {
    return dayjs(date);
  }

  return dayjs(fromDateFormat(date));
}

export function isSameDate(date1: ValidDateData, date2: ValidDateData) {
  return getDayjsObject(date1).isSame(getDayjsObject(date2), 'day');
}

export function dateDiff(
  date1: ValidDateData,
  date2: ValidDateData,
  unit?: dayjs.QUnitType | dayjs.OpUnitType,
) {
  return getDayjsObject(date1).diff(getDayjsObject(date2), unit);
}
