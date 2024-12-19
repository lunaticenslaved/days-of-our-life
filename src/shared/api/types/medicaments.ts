import { Medicament } from '#/shared/models/medicament';

export type CreateMedicamentResponse = Medicament;
export interface CreateMedicamentRequest {
  name: string;
}
