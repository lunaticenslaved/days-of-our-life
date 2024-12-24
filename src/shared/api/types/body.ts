import { DateFormat } from '#/shared/models/date';
import { MedicamentIntake } from '#/shared/models/medicament';
import { BodyStatistics, BodyWeight } from '#shared/models/body';

export type ListBodyStatisticsResponse = BodyStatistics[];
export interface ListBodyStatisticsRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}

export type GetBodyStatisticsResponse = BodyStatistics | null;
export interface GetBodyStatisticsRequest {
  date: DateFormat;
}

export type CreateBodyWeightResponse = BodyWeight;
export interface CreateBodyWeightRequest {
  date: DateFormat;
  weight: number;
}

export type AddMedicamentToDateResponse = MedicamentIntake;
export interface AddMedicamentToDateRequest {
  date: DateFormat;
  medicamentId: string;
  dayPartId: string;
}

export type DeleteMedicamentToDateResponse = void;
export interface DeleteMedicamentToDateRequest {
  date: DateFormat;
  medicamentId: string;
  dayPartId: string;
}
