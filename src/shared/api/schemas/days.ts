import {
  CreateDayPartRequest,
  CreateDayPartResponse,
  DeleteDayPartRequest,
  DeleteDayPartResponse,
  GetDayPartRequest,
  GetDayPartResponse,
  ListDayPartsRequest,
  ListDayPartsResponse,
  UpdateDayPartRequest,
  UpdateDayPartResponse,
} from '#/shared/api/types/days';
import { createAction } from '#shared/api/utils';

export const DaysSchema = {
  parts: {
    create: createAction<CreateDayPartRequest, CreateDayPartResponse>({
      path: () => `/api/days/parts`,
      method: 'POST',
      body: data => data,
    }),
    update: createAction<UpdateDayPartRequest, UpdateDayPartResponse>({
      path: ({ id }) => `/api/days/parts/${id}`,
      method: 'PATCH',
      body: ({ id: _id, ...data }) => data,
    }),
    get: createAction<GetDayPartRequest, GetDayPartResponse>({
      path: ({ id }) => `/api/days/parts/${id}`,
      method: 'GET',
    }),
    delete: createAction<DeleteDayPartRequest, DeleteDayPartResponse>({
      path: ({ id }) => `/api/days/parts/${id}`,
      method: 'DELETE',
    }),
    list: createAction<ListDayPartsRequest, ListDayPartsResponse>({
      path: () => `/api/days/parts`,
      method: 'GET',
    }),
  },
};
