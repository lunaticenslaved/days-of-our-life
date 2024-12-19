import { DateFormat } from '#/shared/models/date';

export const FEMALE_PERIOD_DEFAULT_END = '3000-01-01T00:00:00.000Z';

export interface FemalePeriod {
  id: string;
  startDate: DateFormat;
  endDate: DateFormat;
}
