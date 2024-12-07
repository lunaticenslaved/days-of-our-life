import { Prisma } from '@prisma/client';
import { toDateFormat } from '#shared/models/common';
import { FemalePeriod } from '#shared/models/female-period';

export const SELECT_FEMALE_PERIOD = {
  select: {
    id: true,
    startDate: true,
    endDate: true,
  },
} satisfies Prisma.FemalePeriodDefaultArgs;

type DBFemalePeriod = Prisma.FemalePeriodGetPayload<typeof SELECT_FEMALE_PERIOD>;

export function convertFemalePeriod(data: DBFemalePeriod): FemalePeriod {
  return {
    id: data.id,
    startDate: toDateFormat(data.startDate),
    endDate: toDateFormat(data.endDate),
  };
}
