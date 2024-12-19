import { DateFormat } from '#/shared/models/date';
import { StatisticItem } from '#shared/models/statistics';

export type ListStatisticsResponse = StatisticItem[];
export interface ListStatisticsRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}

export type GetStatisticsResponse = StatisticItem;
export interface GetStatisticsRequest {
  date: DateFormat;
}
