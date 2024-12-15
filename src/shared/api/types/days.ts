import { DayPart } from '#/shared/models/day';

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
