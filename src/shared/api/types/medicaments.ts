import { Medicament } from '#/shared/models/medicament';

// Medicaments
export type CreateMedicamentResponse = Medicament;
export interface CreateMedicamentRequest {
  name: string;
}

export type UpdateMedicamentResponse = Medicament;
export interface UpdateMedicamentRequest extends CreateMedicamentRequest {
  id: string;
}

export type DeleteMedicamentResponse = void;
export interface DeleteMedicamentRequest {
  id: string;
}

export type ListMedicamentsResponse = Medicament[];
export interface ListMedicamentsRequest {}
