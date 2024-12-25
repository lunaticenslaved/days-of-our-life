import { Prisma } from '@prisma/client';
import { BodyStatistics, BodyWeight } from '#/shared/models/body';
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

export const BODY_WEIGHT_SELECTOR = {
  select: {
    date: true,
    weight: true,
  },
} satisfies Prisma.BodyStatisticsDefaultArgs;

export function convertBodyWeightSelector(
  arg: Prisma.BodyStatisticsGetPayload<typeof BODY_WEIGHT_SELECTOR>,
): BodyWeight {
  return {
    ...arg,
    date: DateUtils.toDateFormat(arg.date),
  };
}
