import { Prisma } from '@prisma/client';
import { BodyStatistics } from '#shared/models/body';
import { DateFormat } from '#shared/models/common';

export const SELECT_BODY_STATISTICS = {
  select: {
    date: true,
    weight: true,
  },
} satisfies Prisma.BodyStatisticsDefaultArgs;

type DBBodyStatistics = Prisma.BodyStatisticsGetPayload<typeof SELECT_BODY_STATISTICS>;

export function convertBodyStatistics(data: DBBodyStatistics): BodyStatistics {
  return {
    date: data.date as DateFormat,
    weight: data.weight,
  };
}
