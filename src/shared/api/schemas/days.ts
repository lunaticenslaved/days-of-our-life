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
  GetDayRequest,
  GetDayResponse,
  StartFemalePeriodRequest,
  StartFemalePeriodResponse,
  DeleteFemalePeriodRequest,
  DeleteFemalePeriodResponse,
  CreateBodyWeightRequest,
  CreateBodyWeightResponse,
  AddMedicamentToDateRequest,
  AddMedicamentToDateResponse,
  DeleteMedicamentInDateRequest,
  DeleteMedicamentInDateResponse,
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

  getDay: createAction<GetDayRequest, GetDayResponse>({
    path: ({ date }) => `/api/days/${date}`,
    method: 'GET',
  }),
  listDays: createAction<ListDaysRequest, ListDaysResponse>({
    path: () => `/api/days`,
    method: 'GET',
    query: data => data,
  }),

  // Weight
  createBodyWeight: createAction<CreateBodyWeightRequest, CreateBodyWeightResponse>({
    path: ({ date }) => `/api/days/${date}/body/weight/`,
    method: 'POST',
    body: ({ date: _, ...data }) => data,
  }),

  // Medicaments
  createMedicamentIntake: createAction<
    AddMedicamentToDateRequest,
    AddMedicamentToDateResponse
  >({
    path: ({ date, dayPartId, medicamentId }) =>
      `/api/days/${date}/parts/${dayPartId}/medicaments/${medicamentId}`,
    method: 'POST',
    body: ({ date: _, dayPartId: _dayPartId, medicamentId: _medicamentId, ...data }) =>
      data,
  }),
  deleteMedicamentIntake: createAction<
    DeleteMedicamentInDateRequest,
    DeleteMedicamentInDateResponse
  >({
    path: ({ date, dayPartId, medicamentId }) =>
      `/api/days/${date}/parts/${dayPartId}/medicaments/${medicamentId}`,
    method: 'DELETE',
  }),

  // Female period
  startFemalePeriod: createAction<StartFemalePeriodRequest, StartFemalePeriodResponse>({
    path: ({ startDate }) => `/api/days/${startDate}/female-periods`,
    method: 'POST',
  }),
  deleteFemalePeriod: createAction<DeleteFemalePeriodRequest, DeleteFemalePeriodResponse>(
    {
      path: ({ startDate }) => `/api/days/${startDate}/female-periods`,
      method: 'DELETE',
    },
  ),
};
