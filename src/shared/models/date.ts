import dayjs from '#/shared/libs/dayjs';
import { Dayjs, OpUnitType } from 'dayjs';

// FIXME move to day
export type DateFormat = `${number}-${number}-${number}`;

type ValidDateData = DateFormat | Date;

function getDayjsObject(date: ValidDateData) {
  if (date instanceof Date) {
    return dayjs(date);
  }

  return dayjs(DateUtils.fromDateFormat(date));
}

export const DateUtils = {
  diff(
    date1: ValidDateData,
    date2: ValidDateData,
    unit?: dayjs.QUnitType | dayjs.OpUnitType,
  ) {
    return getDayjsObject(date1).diff(getDayjsObject(date2), unit);
  },
  now() {
    return dayjs();
  },
  isBetween(
    date: ValidDateData,
    dates: [ValidDateData, ValidDateData],
    unit: OpUnitType = 'day',
  ) {
    const dateDJ = getDayjsObject(date);

    if (dateDJ.isSame(getDayjsObject(dates[0]), unit)) {
      return true;
    }

    if (dateDJ.isSame(getDayjsObject(dates[1]), unit)) {
      return true;
    }

    return (
      dateDJ.isAfter(getDayjsObject(dates[0]), unit) &&
      dateDJ.isBefore(getDayjsObject(dates[1]), unit)
    );
  },
  isSame(date1: ValidDateData, date2: ValidDateData, unit: OpUnitType = 'day') {
    return getDayjsObject(date1).isSame(getDayjsObject(date2), unit);
  },
  fromDateFormat(date: DateFormat): Date {
    const offsetMinutes = dayjs().utcOffset();
    return dayjs(date, 'DD-MM-YYYY').startOf('day').add(offsetMinutes, 'minute').toDate();
  },
  toDateFormat(date: string | Date | Dayjs) {
    return dayjs(date)
      .startOf('day')
      .format('DD-MM-YYYY') as `${number}-${number}-${number}`;
  },
  min(...dates: DateFormat[]): DateFormat {
    const min = dayjs.min(...dates.map(DateUtils.fromDateFormat).map(dayjs))?.toDate();

    if (!min) {
      throw new Error('No min date');
    }

    return DateUtils.toDateFormat(min);
  },
  max(...dates: DateFormat[]): DateFormat {
    const max = dayjs.max(...dates.map(DateUtils.fromDateFormat).map(dayjs))?.toDate();

    if (!max) {
      throw new Error('No max date');
    }

    return DateUtils.toDateFormat(max);
  },
  toArray(arg: { start: DateFormat; end: DateFormat }): DateFormat[] {
    const start = DateUtils.fromDateFormat(arg.start);
    const end = DateUtils.fromDateFormat(arg.end);

    const result: DateFormat[] = [];

    let date = dayjs(start);

    while (date.isBefore(end, 'day') || date.isSame(end, 'day')) {
      result.push(DateUtils.toDateFormat(date));
      date = date.add(1, 'day');
    }

    return result;
  },
  toMap<T>(
    arg: { start: DateFormat; end: DateFormat },
    fn: (arg: DateFormat, arg2: { prevDate: DateFormat; nextDate: DateFormat }) => T,
  ): Record<DateFormat, T> {
    const start = DateUtils.fromDateFormat(arg.start);
    const end = DateUtils.fromDateFormat(arg.end);

    const result: Record<DateFormat, T> = {};

    let date = dayjs(start);

    while (date.isBefore(end, 'day') || date.isSame(end, 'day')) {
      result[DateUtils.toDateFormat(date)] = fn(DateUtils.toDateFormat(date), {
        prevDate: DateUtils.toDateFormat(dayjs(date).subtract(1, 'day')),
        nextDate: DateUtils.toDateFormat(dayjs(date).add(1, 'day')),
      });
      date = date.add(1, 'day');
    }

    return result;
  },
  subtract(date: ValidDateData, value: number, unit: 'day' = 'day'): Date {
    const dateF = getDayjsObject(date);
    return dateF.subtract(value, unit).toDate();
  },
  isAfter(date1: ValidDateData, date2: ValidDateData, unit: 'day' = 'day') {
    return getDayjsObject(date1).isAfter(getDayjsObject(date2), unit);
  },
};
