import { Prisma } from '@prisma/client';
import { FemalePeriod } from '#/shared/models/female-period';
import { DateUtils } from '#/shared/models/date';

export const FEMALE_PERIOD_SELECTOR = {
  select: {
    startDay: {
      select: {
        id: true,
        date: true,
      },
    },
  },
} satisfies Prisma.FemalePeriodDefaultArgs;

export function convertFemalePeriodSelector(
  data: Prisma.FemalePeriodGetPayload<typeof FEMALE_PERIOD_SELECTOR>,
): FemalePeriod {
  return {
    startDate: DateUtils.toDateFormat(data.startDay.date),
  };
}
