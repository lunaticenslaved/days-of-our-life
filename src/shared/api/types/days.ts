import { BodyWeight } from '#/shared/models/body';
import { DateFormat } from '#/shared/models/date';
import { DayInfo, DayPart } from '#/shared/models/day';
import { FemalePeriod } from '#/shared/models/female-period';
import { MedicamentIntake } from '#/shared/models/medicament';

export type CreateBodyWeightResponse = BodyWeight;
export interface CreateBodyWeightRequest {
  date: DateFormat;
  weight: number;
}

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

export type UpdateDayPartsResponse = DayPart[];
export interface UpdateDayPartsRequest {
  ids: string[];
}

export type ListDaysResponse = Record<DateFormat, DayInfo>;
export interface ListDaysRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}

export type GetDayResponse = DayInfo;
export interface GetDayRequest {
  date: DateFormat;
}

export type StartFemalePeriodResponse = FemalePeriod;
export interface StartFemalePeriodRequest {
  startDate: DateFormat;
}

export interface DeleteFemalePeriodResponse {}
export interface DeleteFemalePeriodRequest {
  startDate: DateFormat;
}

export type AddMedicamentToDateResponse = MedicamentIntake;
export interface AddMedicamentToDateRequest {
  date: DateFormat;
  medicamentId: string;
  dayPartId: string;
}

export type DeleteMedicamentInDateResponse = void;
export interface DeleteMedicamentInDateRequest {
  date: DateFormat;
  medicamentId: string;
  dayPartId: string;
}
