import { DateFormat } from '#/shared/models/date';
import { Medicament, MedicamentIntake } from '#/shared/models/medicament';

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

// Medicament Intake
export type CreateMedicamentIntakeResponse = MedicamentIntake;
export interface CreateMedicamentIntakeRequest {
  medicamentId: string;
  dayPartId: string;
  date: DateFormat;
}

export type UpdateMedicamentIntakeResponse = MedicamentIntake;
export interface UpdateMedicamentIntakeRequest extends CreateMedicamentIntakeRequest {
  id: string;
}

export type DeleteMedicamentIntakeResponse = void;
export interface DeleteMedicamentIntakeRequest {
  id: string;
}

export type ListMedicamentIntakesResponse = MedicamentIntake[];
export interface ListMedicamentIntakesRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}
