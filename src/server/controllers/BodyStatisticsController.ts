import { convertBodyStatistics, SELECT_BODY_STATISTICS } from '#server/selectors/body';
import { Controller } from '#server/utils/Controller';
import {
  GetBodyStatisticsRequest,
  GetBodyStatisticsResponse,
  PostBodyWeightRequest,
  PostBodyWeightResponse,
} from '#shared/api/types/body';
import { BodyStatisticsValidators } from '#shared/models/body';
import { CommonValidators, DateFormat } from '#shared/models/common';

import { z } from 'zod';

export default new Controller<'body/statistics'>({
  'GET /body/statistics/:date': Controller.handler<
    GetBodyStatisticsRequest,
    GetBodyStatisticsResponse
  >({
    validator: z.object({ date: CommonValidators.dateFormat }),
    parse: req => ({ date: req.params.date as DateFormat }),
    handler: async ({ date }, { prisma }) => {
      return await prisma.bodyStatistics
        .findFirst({ where: { date } })
        .then(data => (data ? convertBodyStatistics(data) : null));
    },
  }),

  'POST /body/statistics/:date/weight': Controller.handler<
    PostBodyWeightRequest,
    PostBodyWeightResponse
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
