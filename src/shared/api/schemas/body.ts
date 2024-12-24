import {
  GetBodyStatisticsRequest,
  GetBodyStatisticsResponse,
  ListBodyStatisticsRequest,
  ListBodyStatisticsResponse,
} from '#shared/api/types/body';
import { createAction } from '#shared/api/utils';
import _ from 'lodash';

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
  },
};
