import {
  GetBodyStatisticsRequest,
  GetBodyStatisticsResponse,
  ListBodyStatisticsRequest,
  ListBodyStatisticsResponse,
  PostBodyWeightRequest,
  PostBodyWeightResponse,
} from '#shared/api/types/body';
import { createAction } from '#shared/api/utils';

export const BodySchema = {
  statistics: {
    get: createAction<GetBodyStatisticsRequest, GetBodyStatisticsResponse>({
      path: ({ date }) => `/api/body/statistics/${date}`,
      method: 'GET',
    }),
    list: createAction<ListBodyStatisticsRequest, ListBodyStatisticsResponse>({
      path: () => `/api/body/statistics`,
      method: 'GET',
      query: ({ startDate, endDate }) => ({ startDate, endDate }),
    }),

    weight: {
      create: createAction<PostBodyWeightRequest, PostBodyWeightResponse>({
        path: ({ date }) => `/api/body/statistics/${date}/weight`,
        method: 'POST',
        body: ({ date: _date, ...data }) => data,
      }),
    },
  },
};
