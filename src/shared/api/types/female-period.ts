import { DateFormat } from '#/shared/models/date';
import { FemalePeriod } from '#/shared/models/female-period';

export type CreateFemalePeriodResponse = FemalePeriod;
export interface CreateFemalePeriodRequest {
  startDate: DateFormat;
}

export interface DeleteFemalePeriodResponse {}
export interface DeleteFemalePeriodRequest {
  id: string;
}
