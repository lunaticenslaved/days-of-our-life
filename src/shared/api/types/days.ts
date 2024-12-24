import { DateFormat } from '#/shared/models/date';
import { DayInfo, DayPart } from '#/shared/models/day';
import { MedicamentIntake } from '#/shared/models/medicament';

export interface ListDayPartsRequest {}
export type ListDayPartsResponse = DayPart[];

export type CreateDayPartResponse = DayPart;
export interface CreateDayPartRequest {
  name: string;
}

export type UpdateDayPartResponse = DayPart;
export interface UpdateDayPartRequest {
  id: string;
  name: string;
}

export type GetDayPartResponse = DayPart;
export interface GetDayPartRequest {
  id: string;
}

export type DeleteDayPartResponse = void;
export interface DeleteDayPartRequest {
  id: string;
}

export type UpdateOrderDayPartResponse = DayPart[];
export interface UpdateOrderDayPartRequest {
  ids: string[];
}

export type ListDaysResponse = Record<DateFormat, DayInfo>;
export interface ListDaysRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}

export type DeleteMedicamentIntakeResponse = void;
export interface DeleteMedicamentIntakeRequest {
  date: DateFormat;
  medicamentId: string;
  dayPartId: string;
}

export type CreateMedicamentIntakeResponse = MedicamentIntake;
export interface CreateMedicamentIntakeRequest {
  medicamentId: string;
  dayPartId: string;
  date: DateFormat;
}
