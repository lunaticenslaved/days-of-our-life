import { BodyStatistics } from '#shared/models/body';
import { DateFormat } from '#shared/models/common';

export type ListBodyStatisticsResponse = BodyStatistics[];
export interface ListBodyStatisticsRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}

export type GetBodyStatisticsResponse = BodyStatistics | null;
export interface GetBodyStatisticsRequest {
  date: DateFormat;
}

export type PostBodyWeightResponse = BodyStatistics;
export interface PostBodyWeightRequest {
  weight: number;
  date: DateFormat;
}
