import { DateFormat, DateUtils } from '#/shared/models/date';
import { convertBodyStatistics } from '#server/selectors/body';
import { Controller } from '#server/utils/Controller';
import {
  GetBodyStatisticsRequest,
  GetBodyStatisticsResponse,
  ListBodyStatisticsRequest,
  ListBodyStatisticsResponse,
} from '#shared/api/types/body';
import { CommonValidators } from '#shared/models/common';

import { z } from 'zod';

export default new Controller<'body/statistics'>({
  'GET /body/statistics/:date': Controller.handler<
    GetBodyStatisticsRequest,
    GetBodyStatisticsResponse
  >({
    validator: z.object({ date: CommonValidators.dateFormat }),
    parse: req => ({ date: req.params.date as DateFormat }),
    handler: async (arg, { prisma }) => {
      const date = DateUtils.fromDateFormat(arg.date);

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
      const startDate = DateUtils.fromDateFormat(arg.startDate);
      const endDate = DateUtils.fromDateFormat(arg.endDate);

      return await prisma.bodyStatistics
        .findMany({
          where: {
            date: { gte: startDate, lte: endDate },
          },
        })
        .then(data => data.map(convertBodyStatistics));
    },
  }),
});
