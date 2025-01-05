import { DateFormat, DateUtils } from '#/shared/models/date';

export const FEMALE_PERIOD_DEFAULT_END = '3000-01-01T00:00:00.000Z';

export interface FemalePeriod {
  startDate: DateFormat;
}

export const FemalePeriodUtils = {
  find(date: DateFormat, periods: FemalePeriod[]): FemalePeriod | undefined {
    const femalePeriod = periods.find(period => {
      return (
        DateUtils.isSame(date, period.startDate, 'day') ||
        DateUtils.isAfter(date, period.startDate, 'day')
      );
    });

    return femalePeriod;
  },
};
