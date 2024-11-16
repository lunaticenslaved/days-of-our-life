import { DateFormat } from '#shared/models/common';
import { ERROR_MESSAGES } from '#shared/validation';
import { z } from 'zod';

export const BodyStatisticsValidators = {
  weight: z.number({ message: ERROR_MESSAGES.required }).gt(0, ERROR_MESSAGES.gt(0)),
};

export interface BodyStatistics {
  date: DateFormat;
  weight: number;
}
