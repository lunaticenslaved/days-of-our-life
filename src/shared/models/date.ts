import dayjs from '#shared/libs/dayjs';
import { Dayjs, OpUnitType } from 'dayjs';

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
};
