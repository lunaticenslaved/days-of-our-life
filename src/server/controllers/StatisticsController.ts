import { DateFormat, DateUtils } from '#/shared/models/date';
import { convertFoodNutrients, ONLY_NUTRIENTS_SELECT } from '#server/selectors/food';
import { Controller } from '#server/utils/Controller';

import {
  GetStatisticsRequest,
  GetStatisticsResponse,
  ListStatisticsRequest,
  ListStatisticsResponse,
} from '#shared/api/types/statistics';
import { CommonValidators } from '#shared/models/common';
import { FEMALE_PERIOD_DEFAULT_END } from '#shared/models/female-period';
import { FoodNutrients, sumNutrients } from '#shared/models/food';
import { StatisticItem } from '#shared/models/statistics';
import dayjs from 'dayjs';

import { z } from 'zod';

export default new Controller<'statistics'>({
  'GET /statistics': Controller.handler<ListStatisticsRequest, ListStatisticsResponse>({
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

      const body = await prisma.bodyStatistics
        .findMany({
          where: { date: { gte: startDate, lte: endDate } },
        })
        .then(items =>
          items.reduce(
            (acc, { date, weight }) => ({
              ...acc,
              [DateUtils.toDateFormat(date)]: { weight },
            }),
            {} as Record<string, { weight: number | null }>,
          ),
        );
      const foodDays = await prisma.foodTrackerDay
        .findMany({
          where: { date: { gte: startDate, lte: endDate } },
          select: {
            date: true,
            meals: {
              select: {
                nutrients: ONLY_NUTRIENTS_SELECT,
              },
            },
          },
        })
        .then(items =>
          items.reduce(
            (acc, { date, meals }) => {
              return {
                ...acc,
                [DateUtils.toDateFormat(date)]: sumNutrients(
                  meals.map(i => convertFoodNutrients(i.nutrients)),
                ),
              };
            },
            {} as Record<string, FoodNutrients>,
          ),
        );

      const results: StatisticItem[] = [];

      let date = dayjs(startDate);

      let period: { startDate: Date; endDate: Date } | null = null;

      do {
        const dateISO = date.toISOString();
        const dateKey = DateUtils.toDateFormat(date);

        if (!period || dayjs(period.startDate).isBefore(dateISO)) {
          period = await prisma.femalePeriod.findFirst({
            where: { startDate: { lte: dateISO }, endDate: { gte: dateISO } },
            select: { startDate: true, endDate: true },
          });
        }

        results.push({
          date: dateKey,
          body: {
            weight: body[dateKey]?.weight || undefined,
          },
          food: {
            nutrients: foodDays[dateKey] || undefined,
          },
          period: period
            ? {
                startDate: DateUtils.toDateFormat(period.startDate),
                endDate: dayjs(period.endDate).isSame(FEMALE_PERIOD_DEFAULT_END, 'day')
                  ? undefined
                  : DateUtils.toDateFormat(period.endDate),
              }
            : undefined,
        });

        date = date.add(1, 'day');
      } while (dayjs(date) <= dayjs(endDate));

      return results;
    },
  }),

  'GET /statistics/:date': Controller.handler<
    GetStatisticsRequest,
    GetStatisticsResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
    }),
    handler: async (arg, { prisma }) => {
      const date = DateUtils.fromDateFormat(arg.date);

      const body = await prisma.bodyStatistics.findFirst({ where: { date } });
      const foodDay = await prisma.foodTrackerDay.findFirst({
        where: { date },
        select: {
          date: true,
          meals: {
            select: {
              nutrients: ONLY_NUTRIENTS_SELECT,
            },
          },
        },
      });

      const period = await prisma.femalePeriod.findFirst({
        where: { startDate: { lte: date }, endDate: { gte: date } },
        select: { startDate: true, endDate: true },
      });

      return {
        date: DateUtils.toDateFormat(date),
        body: {
          weight: body?.weight,
        },
        food: {
          nutrients: convertFoodNutrients(
            sumNutrients(
              foodDay?.meals.map(i => convertFoodNutrients(i.nutrients)) || [],
            ),
          ),
        },
        period: period
          ? {
              startDate: DateUtils.toDateFormat(period.startDate),
              endDate: dayjs(period.endDate).isSame(FEMALE_PERIOD_DEFAULT_END, 'day')
                ? undefined
                : DateUtils.toDateFormat(period.endDate),
            }
          : undefined,
      };
    },
  }),
});
