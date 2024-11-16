import { BodyStatistics } from '#shared/models/body';
import { DateFormat } from '#shared/models/common';

export interface GetBodyStatisticsRequest {}
export type GetBodyStatisticsResponse = BodyStatistics[];

export type PostBodyStatisticResponse = BodyStatistics;
export interface PostBodyStatisticRequest {
  weight: number;
  date: DateFormat;
}
