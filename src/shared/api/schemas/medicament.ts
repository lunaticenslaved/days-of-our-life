import {
  CreateMedicamentIntakeRequest,
  CreateMedicamentIntakeResponse,
  CreateMedicamentRequest,
  CreateMedicamentResponse,
  DeleteMedicamentIntakeRequest,
  DeleteMedicamentIntakeResponse,
  DeleteMedicamentRequest,
  DeleteMedicamentResponse,
  ListMedicamentIntakesRequest,
  ListMedicamentIntakesResponse,
  ListMedicamentsRequest,
  ListMedicamentsResponse,
  UpdateMedicamentIntakeRequest,
  UpdateMedicamentIntakeResponse,
  UpdateMedicamentRequest,
  UpdateMedicamentResponse,
} from '#/shared/api/types/medicaments';
import { createAction } from '#shared/api/utils';

export const MedicamentsSchema = {
  medicaments: {
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
  },
  intakes: {
    create: createAction<CreateMedicamentIntakeRequest, CreateMedicamentIntakeResponse>({
      path: ({ medicamentId }) => `/api/medicaments/${medicamentId}/intakes`,
      method: 'POST',
      body: ({ medicamentId: _, ...data }) => data,
    }),
    update: createAction<UpdateMedicamentIntakeRequest, UpdateMedicamentIntakeResponse>({
      path: ({ id }) => `/api/medicaments/intakes/${id}`,
      method: 'PATCH',
      body: ({ id: _id, ...data }) => data,
    }),
    delete: createAction<DeleteMedicamentIntakeRequest, DeleteMedicamentIntakeResponse>({
      path: ({ id }) => `/api/medicaments/intakes/${id}`,
      method: 'DELETE',
    }),
    list: createAction<ListMedicamentIntakesRequest, ListMedicamentIntakesResponse>({
      path: () => `/api/medicaments/intakes`,
      method: 'GET',
      query: data => ({ startDate: data.startDate, endDate: data.endDate }),
    }),
  },
};
