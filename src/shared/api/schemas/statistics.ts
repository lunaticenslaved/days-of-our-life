import {
  GetStatisticsRequest,
  GetStatisticsResponse,
  ListStatisticsRequest,
  ListStatisticsResponse,
} from '#shared/api/types/statistics';
import { createAction } from '#shared/api/utils';

export const StatisticsSchema = {
  list: createAction<ListStatisticsRequest, ListStatisticsResponse>({
    path: () => `/api/statistics`,
    method: 'GET',
    query: data => ({
      startDate: data.startDate,
      endDate: data.endDate,
    }),
  }),
  get: createAction<GetStatisticsRequest, GetStatisticsResponse>({
    path: ({ date }) => `/api/statistics/${date}`,
    method: 'GET',
  }),
};
