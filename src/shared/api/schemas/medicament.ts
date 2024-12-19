import {
  CreateMedicamentRequest,
  CreateMedicamentResponse,
} from '#/shared/api/types/medicaments';
import { createAction } from '#shared/api/utils';

export const MedicamentsSchema = {
  create: createAction<CreateMedicamentRequest, CreateMedicamentResponse>({
    path: () => `/api/medicaments`,
    method: 'POST',
    body: data => data,
  }),
  //   update: createAction<UpdateDayPartRequest, UpdateDayPartResponse>({
  //     path: ({ id }) => `/api/days/parts/${id}`,
  //     method: 'PATCH',
  //     body: ({ id: _id, ...data }) => data,
  //   }),
  //   get: createAction<GetDayPartRequest, GetDayPartResponse>({
  //     path: ({ id }) => `/api/days/parts/${id}`,
  //     method: 'GET',
  //   }),
  //   delete: createAction<DeleteDayPartRequest, DeleteDayPartResponse>({
  //     path: ({ id }) => `/api/days/parts/${id}`,
  //     method: 'DELETE',
  //   }),
  //   list: createAction<ListDayPartsRequest, ListDayPartsResponse>({
  //     path: () => `/api/days/parts`,
  //     method: 'GET',
  //   }),
};
