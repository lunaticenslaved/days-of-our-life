import { convertFoodNutrients, ONLY_NUTRIENTS_SELECT } from '#/server/selectors/food';
import {
  convertMedicamentIntakeSelector,
  MEDICAMENT_INTAKE_SELECTOR,
} from '#/server/selectors/medicaments';
import { ListDaysRequest, ListDaysResponse } from '#/shared/api/types/days';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayInfo } from '#/shared/models/day';
import { FoodNutrients, sumNutrients } from '#/shared/models/food';
import { MedicamentIntake } from '#/shared/models/medicament';
import { BODY_WEIGHT_SELECTOR, convertBodyWeightSelector } from '#server/selectors/body';
import { Controller } from '#server/utils/Controller';
import {
  AddMedicamentToDateRequest,
  AddMedicamentToDateResponse,
  CreateBodyWeightRequest,
  CreateBodyWeightResponse,
  DeleteMedicamentToDateRequest,
  DeleteMedicamentToDateResponse,
} from '#shared/api/types/body';
import { CommonValidators } from '#shared/models/common';

import { z } from 'zod';

// FIXME remove old
export default new Controller<'days'>({
  'GET /days': Controller.handler<ListDaysRequest, ListDaysResponse>({
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

      const result: ListDaysResponse = DateUtils.toMap(
        {
          start: arg.startDate,
          end: arg.endDate,
        },
        date => ({ date }),
      );

      function addToResult(
        _date: Date,
        data: {
          weight?: number;
          nutrients?: FoodNutrients;
          medicamentIntake?: MedicamentIntake;
        },
      ) {
        const date = DateUtils.toDateFormat(_date);

        const item: DayInfo = {
          ...(result[date] || {}),
          date,
        };

        if (typeof data.weight === 'number') {
          item.weight = data.weight;
        }

        if (data.nutrients) {
          item.nutrients = data.nutrients;
        }

        if (data.medicamentIntake) {
          item.medicamentIntakes = [
            ...(item.medicamentIntakes || []),
            data.medicamentIntake,
          ];
        }

        result[date] = item;
      }

      const weights = await prisma.bodyStatistics.findMany({
        ...BODY_WEIGHT_SELECTOR,
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      for (const { date, weight } of weights) {
        addToResult(date, { weight });
      }

      const nutrients = await prisma.foodTrackerDay.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          date: true,
          meals: {
            select: {
              nutrients: ONLY_NUTRIENTS_SELECT,
            },
          },
        },
      });

      for (const { date, meals } of nutrients) {
        addToResult(date, {
          nutrients: sumNutrients(
            meals.map(meal => convertFoodNutrients(meal.nutrients)),
          ),
        });
      }

      const medicamentIntakes = await prisma.medicamentIntake.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        ...MEDICAMENT_INTAKE_SELECTOR,
      });

      for (const medicamentIntake of medicamentIntakes) {
        addToResult(medicamentIntake.date, {
          medicamentIntake: convertMedicamentIntakeSelector(medicamentIntake),
        });
      }

      return result;
    },
  }),

  'POST /days/:date/body/weight': Controller.handler<
    CreateBodyWeightRequest,
    CreateBodyWeightResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      weight: CommonValidators.number({ min: 0 }),
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      weight: req.body.weight,
    }),
    handler: async ({ weight, ...arg }, { prisma }) => {
      const date = DateUtils.fromDateFormat(arg.date);

      return await prisma.bodyStatistics
        .upsert({
          ...BODY_WEIGHT_SELECTOR,
          where: { date },
          update: {
            weight,
          },
          create: {
            date,
            weight,
          },
        })
        .then(convertBodyWeightSelector);
    },
  }),

  'POST /days/:date/parts/:dayPartId/medicaments/:medicamentId': Controller.handler<
    AddMedicamentToDateRequest,
    AddMedicamentToDateResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      medicamentId: CommonValidators.id,
      dayPartId: CommonValidators.id,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      medicamentId: req.params.medicamentId,
      dayPartId: req.params.dayPartId,
    }),
    handler: async ({ medicamentId, dayPartId, ...arg }, { prisma }) => {
      const date = DateUtils.fromDateFormat(arg.date);

      return await prisma.medicamentIntake
        .create({
          ...MEDICAMENT_INTAKE_SELECTOR,
          data: {
            medicamentId,
            dayPartId,
            date,
          },
        })
        .then(convertMedicamentIntakeSelector);
    },
  }),

  'DELETE /days/:date/parts/:dayPartId/medicaments/:medicamentId': Controller.handler<
    DeleteMedicamentToDateRequest,
    DeleteMedicamentToDateResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      medicamentId: CommonValidators.id,
      dayPartId: CommonValidators.id,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      medicamentId: req.params.medicamentId,
      dayPartId: req.params.dayPartId,
    }),
    handler: async ({ medicamentId, dayPartId, ...arg }, { prisma }) => {
      const date = DateUtils.fromDateFormat(arg.date);

      await prisma.medicamentIntake.deleteMany({
        where: {
          medicamentId,
          dayPartId,
          date,
        },
      });
    },
  }),
});
