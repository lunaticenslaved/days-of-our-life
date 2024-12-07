import {
  CreateFemalePeriodRequest,
  CreateFemalePeriodResponse,
  DeleteFemalePeriodRequest,
  DeleteFemalePeriodResponse,
  ListFemalePeriodRequest,
  ListFemalePeriodResponse,
} from '#shared/api/types/female-period';
import { createAction } from '#shared/api/utils';

export const FemalePeriodSchema = {
  list: createAction<ListFemalePeriodRequest, ListFemalePeriodResponse>({
    path: () => `/api/female-periods`,
    method: 'GET',
    query: ({ startDate, endDate }) => ({ startDate, endDate }),
  }),
  create: createAction<CreateFemalePeriodRequest, CreateFemalePeriodResponse>({
    path: () => `/api/female-periods`,
    method: 'POST',
    body: data => data,
  }),
  delete: createAction<DeleteFemalePeriodRequest, DeleteFemalePeriodResponse>({
    path: ({ id }) => `/api/female-periods/${id}`,
    method: 'DELETE',
  }),
};
