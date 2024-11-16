import { convertBodyStatistics, SELECT_BODY_STATISTICS } from '#server/selectors/body';
import { Controller } from '#server/utils/Controller';
import {
  GetBodyStatisticsRequest,
  GetBodyStatisticsResponse,
  PostBodyStatisticRequest,
  PostBodyStatisticResponse,
} from '#shared/api/types/body';
import { BodyStatisticsValidators } from '#shared/models/body';
import { CommonValidators, DateFormat } from '#shared/models/common';

import { z } from 'zod';

export default new Controller<'body/statistics'>({
  'GET /body/statistics': Controller.handler<
    GetBodyStatisticsRequest,
    GetBodyStatisticsResponse
  >({
    validator: z.object({}),
    parse: req => req.body,
    handler: async (_, { prisma }) => {
      return await prisma.bodyStatistics
        .findMany()
        .then(data => data.map(convertBodyStatistics));
    },
  }),

  'POST /body/statistics/:date': Controller.handler<
    PostBodyStatisticRequest,
    PostBodyStatisticResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      weight: BodyStatisticsValidators.weight,
    }),
    parse: req => ({ date: req.params.date as DateFormat, weight: req.body.weight }),
    handler: async ({ date, weight }, { prisma }) => {
      return await prisma.bodyStatistics
        .upsert({
          where: { date },
          create: { date, weight },
          update: { weight },
          ...SELECT_BODY_STATISTICS,
        })
        .then(convertBodyStatistics);
    },
  }),
});
