import { Prisma } from '@prisma/client';
import { FemalePeriod } from '#shared/models/female-period';
import { DateUtils } from '#/shared/models/date';

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
    startDate: DateUtils.toDateFormat(data.startDate),
    endDate: DateUtils.toDateFormat(data.endDate),
  };
}
