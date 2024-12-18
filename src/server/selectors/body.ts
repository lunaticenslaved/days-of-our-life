import { Prisma } from '@prisma/client';
import { BodyStatistics } from '#shared/models/body';
import { DateUtils } from '#/shared/models/date';

export const SELECT_BODY_STATISTICS = {
  select: {
    date: true,
    weight: true,
  },
} satisfies Prisma.BodyStatisticsDefaultArgs;

type DBBodyStatistics = Prisma.BodyStatisticsGetPayload<typeof SELECT_BODY_STATISTICS>;

export function convertBodyStatistics(data: DBBodyStatistics): BodyStatistics {
  return {
    date: DateUtils.toDateFormat(data.date),
    weight: data.weight,
  };
}
