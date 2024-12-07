import {
  convertFemalePeriod,
  SELECT_FEMALE_PERIOD,
} from '#server/selectors/female-period';
import FemalePeriodService from '#server/services/FemalePeriodService';
import { Controller } from '#server/utils/Controller';
import {
  CreateFemalePeriodRequest,
  CreateFemalePeriodResponse,
  DeleteFemalePeriodRequest,
  DeleteFemalePeriodResponse,
  ListFemalePeriodRequest,
  ListFemalePeriodResponse,
} from '#shared/api/types/female-period';

import { CommonValidators, DateFormat, fromDateFormat } from '#shared/models/common';
import { FEMALE_PERIOD_DEFAULT_END } from '#shared/models/female-period';
import dayjs from 'dayjs';
import _ from 'lodash';

import { z } from 'zod';

export default new Controller<'female-periods'>({
  'GET /female-periods': Controller.handler<
    ListFemalePeriodRequest,
    ListFemalePeriodResponse
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
      return await FemalePeriodService.list(arg, prisma);
    },
  }),

  'POST /female-periods': Controller.handler<
    CreateFemalePeriodRequest,
    CreateFemalePeriodResponse
  >({
    validator: z.object({
      startDate: CommonValidators.dateFormat,
    }),
    parse: req => ({
      startDate: req.body.startDate as DateFormat,
    }),
    handler: async (arg, { prisma }) => {
      const startDate = fromDateFormat(arg.startDate);

      return await prisma.$transaction(async trx => {
        if (await trx.femalePeriod.findFirst({ where: { startDate } })) {
          throw new Error('Period on that date exists');
        }

        const prevPeriod = await trx.femalePeriod.findFirst({
          where: { startDate: { lt: startDate } },
          orderBy: { startDate: 'desc' },
        });

        const nextPeriod = await trx.femalePeriod.findFirst({
          where: { startDate: { gt: startDate } },
          orderBy: { startDate: 'desc' },
        });

        if (prevPeriod) {
          await trx.femalePeriod.updateMany({
            where: { id: prevPeriod.id },
            data: { endDate: dayjs(startDate).subtract(1, 'day').endOf('day').toDate() },
          });
        }

        let endDate = FEMALE_PERIOD_DEFAULT_END;

        if (nextPeriod) {
          endDate = dayjs(nextPeriod.startDate)
            .subtract(1, 'day')
            .endOf('day')
            .toISOString();
        }

        const { id } = await trx.femalePeriod.create({
          data: { startDate, endDate },
        });

        await FemalePeriodService.orderPeriods({}, trx);

        return await trx.femalePeriod
          .findFirstOrThrow({
            where: { id },
            ...SELECT_FEMALE_PERIOD,
          })
          .then(convertFemalePeriod);
      });
    },
  }),

  'DELETE /female-periods/:id': Controller.handler<
    DeleteFemalePeriodRequest,
    DeleteFemalePeriodResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      await prisma.$transaction(async trx => {
        await trx.femalePeriod.delete({ where: { id } });
        await FemalePeriodService.orderPeriods({}, trx);
      });
    },
  }),
});
