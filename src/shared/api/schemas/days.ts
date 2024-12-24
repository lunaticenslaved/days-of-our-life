import {
  CreateBodyWeightRequest,
  CreateBodyWeightResponse,
} from '#/shared/api/types/body';
import {
  CreateDayPartRequest,
  CreateDayPartResponse,
  DeleteDayPartRequest,
  DeleteDayPartResponse,
  GetDayPartRequest,
  GetDayPartResponse,
  ListDayPartsRequest,
  ListDayPartsResponse,
  ListDaysRequest,
  ListDaysResponse,
  UpdateDayPartRequest,
  UpdateDayPartResponse,
  CreateMedicamentIntakeRequest,
  CreateMedicamentIntakeResponse,
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

  listDays: createAction<ListDaysRequest, ListDaysResponse>({
    path: () => `/api/days`,
    method: 'GET',
    query: data => data,
  }),
  createBodyWeight: createAction<CreateBodyWeightRequest, CreateBodyWeightResponse>({
    path: ({ date }) => `/api/days/${date}/body/weight/`,
    method: 'POST',
    body: ({ date: _, ...data }) => data,
  }),
  createMedicamentIntake: createAction<
    CreateMedicamentIntakeRequest,
    CreateMedicamentIntakeResponse
  >({
    path: ({ date, dayPartId, medicamentId }) =>
      `/api/days/${date}/parts/${dayPartId}/medicaments/${medicamentId}`,
    method: 'POST',
    body: ({ date: _, dayPartId: _dayPartId, medicamentId: _medicamentId, ...data }) =>
      data,
  }),
  deleteMedicamentIntake: createAction<
    CreateMedicamentIntakeRequest,
    CreateMedicamentIntakeResponse
  >({
    path: ({ date, dayPartId, medicamentId }) =>
      `/api/days/${date}/parts/${dayPartId}/medicaments/${medicamentId}`,
    method: 'DELETE',
  }),
};
