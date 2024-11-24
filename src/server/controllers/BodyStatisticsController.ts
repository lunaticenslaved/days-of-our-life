import { convertBodyStatistics, SELECT_BODY_STATISTICS } from '#server/selectors/body';
import { Controller } from '#server/utils/Controller';
import {
  GetBodyStatisticsRequest,
  GetBodyStatisticsResponse,
  ListBodyStatisticsRequest,
  ListBodyStatisticsResponse,
  PostBodyWeightRequest,
  PostBodyWeightResponse,
} from '#shared/api/types/body';
import { BodyStatisticsValidators } from '#shared/models/body';
import { CommonValidators, DateFormat, fromDateFormat } from '#shared/models/common';

import { z } from 'zod';

export default new Controller<'body/statistics'>({
  'GET /body/statistics/:date': Controller.handler<
    GetBodyStatisticsRequest,
    GetBodyStatisticsResponse
  >({
    validator: z.object({ date: CommonValidators.dateFormat }),
    parse: req => ({ date: req.params.date as DateFormat }),
    handler: async (arg, { prisma }) => {
      const date = fromDateFormat(arg.date);

      return await prisma.bodyStatistics
        .findFirst({ where: { date } })
        .then(data => (data ? convertBodyStatistics(data) : null));
    },
  }),

  'GET /body/statistics': Controller.handler<
    ListBodyStatisticsRequest,
    ListBodyStatisticsResponse
  >({
    validator: z.object({
      startDate: CommonValidators.dateFormat,
      endDate: CommonValidators.dateFormat,
    }),
    parse: req => ({
      startDate: req.query.startDate as DateFormat,
      endDate: req.query.endDate as DateFormat,
    }),
    handler: async (arg, { prisma }) => {
      const startDate = fromDateFormat(arg.startDate);
      const endDate = fromDateFormat(arg.endDate);

      return await prisma.bodyStatistics
        .findMany({
          where: {
            date: { gte: startDate, lte: endDate },
          },
        })
        .then(data => data.map(convertBodyStatistics));
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
    handler: async ({ weight, ...arg }, { prisma }) => {
      const date = fromDateFormat(arg.date);

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
