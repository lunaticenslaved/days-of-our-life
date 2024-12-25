import {
  CreateMedicamentRequest,
  CreateMedicamentResponse,
  DeleteMedicamentRequest,
  DeleteMedicamentResponse,
  ListMedicamentsRequest,
  ListMedicamentsResponse,
  UpdateMedicamentRequest,
  UpdateMedicamentResponse,
} from '#/shared/api/types/medicaments';
import { createAction } from '#/shared/api/utils';

export const MedicamentsSchema = {
  create: createAction<CreateMedicamentRequest, CreateMedicamentResponse>({
    path: () => `/api/medicaments`,
    method: 'POST',
    body: data => data,
  }),
  update: createAction<UpdateMedicamentRequest, UpdateMedicamentResponse>({
    path: ({ id }) => `/api/medicaments/${id}`,
    method: 'PATCH',
    body: ({ id: _id, ...data }) => data,
  }),
  delete: createAction<DeleteMedicamentRequest, DeleteMedicamentResponse>({
    path: ({ id }) => `/api/medicaments/${id}`,
    method: 'DELETE',
  }),
  //   get: createAction<GetDayPartRequest, GetDayPartResponse>({
  //     path: ({ id }) => `/api/days/parts/${id}`,
  //     method: 'GET',
  //   }),
  list: createAction<ListMedicamentsRequest, ListMedicamentsResponse>({
    path: () => `/api/medicaments`,
    method: 'GET',
  }),
};
