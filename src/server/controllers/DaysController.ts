import { convertFoodNutrients, ONLY_NUTRIENTS_SELECT } from '#/server/selectors/food';
import {
  convertMedicamentIntakeSelector,
  MEDICAMENT_INTAKE_SELECTOR,
} from '#/server/selectors/medicaments';
import FemalePeriodService from '#/server/services/FemalePeriodService';
import {
  StartFemalePeriodRequest,
  StartFemalePeriodResponse,
  DeleteFemalePeriodRequest,
  DeleteFemalePeriodResponse,
  GetDayRequest,
  GetDayResponse,
  ListDaysRequest,
  ListDaysResponse,
  AddMedicamentToDateRequest,
  AddMedicamentToDateResponse,
  CreateBodyWeightRequest,
  CreateBodyWeightResponse,
  DeleteMedicamentInDateRequest,
  DeleteMedicamentInDateResponse,
  CreateDayPartRequest,
  CreateDayPartResponse,
  DeleteDayPartRequest,
  DeleteDayPartResponse,
  ListDayPartsRequest,
  ListDayPartsResponse,
  UpdateDayPartRequest,
  UpdateDayPartResponse,
  UpdateDayPartsRequest,
  UpdateDayPartsResponse,
  AddCosmeticProductToDateResponse,
  AddCosmeticProductToDateRequest,
  RemoveCosmeticProductFromDateRequest,
  RemoveCosmeticProductFromDateResponse,
} from '#/shared/api/types/days';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayInfo, DayPart } from '#/shared/models/day';
import { FoodNutrients, sumNutrients } from '#/shared/models/food';
import { MedicamentIntake } from '#/shared/models/medicament';
import { BODY_WEIGHT_SELECTOR, convertBodyWeightSelector } from '#/server/selectors/body';
import { Controller } from '#/server/utils/Controller';
import { CommonValidators } from '#/shared/models/common';

import {
  convertCosmeticProductApplicationSelector,
  convertDayPartSelector,
  COSMETIC_PRODUCT_APPLY_SELECTOR,
  DAY_PART_SELECTOR,
} from '#/server/selectors/days';
import {} from '#/shared/api/types/days';
import _ from 'lodash';

import { z } from 'zod';
import DayService from '#/server/services/DayService';

export default new Controller<'days'>({
  // Day parts
  'GET /days/parts': Controller.handler<ListDayPartsRequest, ListDayPartsResponse>({
    validator: z.object({}),
    parse: req => ({
      startDate: req.query.startDate as DateFormat,
      endDate: req.query.endDate as DateFormat,
    }),
    handler: async (_, { prisma }) => {
      return prisma.dayPart
        .findMany({
          orderBy: { order: 'asc' },
          ...DAY_PART_SELECTOR,
        })
        .then(items => items.map(convertDayPartSelector));
    },
  }),

  'PATCH /days/parts': Controller.handler<UpdateDayPartsRequest, UpdateDayPartsResponse>({
    validator: z.object({
      ids: z.array(CommonValidators.str(255)),
    }),
    parse: req => ({
      ids: req.body.name,
    }),
    handler: async ({ ids }, { prisma }) => {
      return await prisma.$transaction(async trx => {
        const result: DayPart[] = [];

        for (let i = 0; i < ids.length; i++) {
          await trx.dayPart.update({
            where: { id: ids[i] },
            data: { order: i },
          });
        }

        return result;
      });
    },
  }),

  'POST /days/parts': Controller.handler<CreateDayPartRequest, CreateDayPartResponse>({
    validator: z.object({
      name: CommonValidators.str(255),
    }),
    parse: req => ({
      name: req.body.name,
    }),
    handler: async ({ name }, { prisma }) => {
      return prisma.dayPart
        .create({
          data: { name },
          ...DAY_PART_SELECTOR,
        })
        .then(convertDayPartSelector);
    },
  }),

  'PATCH /days/parts/:id': Controller.handler<
    UpdateDayPartRequest,
    UpdateDayPartResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
      name: CommonValidators.str(255),
    }),
    parse: req => ({
      id: req.params.id,
      name: req.body.name,
    }),
    handler: async ({ id, name }, { prisma }) => {
      return prisma.dayPart
        .update({
          where: { id },
          data: { name },
          ...DAY_PART_SELECTOR,
        })
        .then(convertDayPartSelector);
    },
  }),

  'DELETE /days/parts/:id': Controller.handler<
    DeleteDayPartRequest,
    DeleteDayPartResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      // FIXME не удалять, если есть привязанные сущности
      await prisma.dayPart.delete({
        where: { id },
      });
    },
  }),

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

      const date = {
        gte: startDate,
        lte: endDate,
      };

      const femalePeriodsDesc = await FemalePeriodService.list(
        {
          startDate: arg.startDate,
          endDate: arg.endDate,
        },
        prisma,
      ).then(items => [...items].reverse());

      const result: ListDaysResponse = DateUtils.toMap(
        {
          start: arg.startDate,
          end: arg.endDate,
        },
        date => {
          const femalePeriod = femalePeriodsDesc.find(period => {
            return (
              DateUtils.isSame(date, period.startDate, 'day') ||
              DateUtils.isAfter(date, period.startDate, 'day')
            );
          });

          return {
            date,
            femalePeriod: femalePeriod
              ? {
                  startDate: femalePeriod.startDate,
                }
              : undefined,
            cosmeticProductApplications: [],
          };
        },
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
        where: { date },
      });

      for (const { date, weight } of weights) {
        addToResult(date, { weight });
      }

      const nutrients = await prisma.foodTrackerDay.findMany({
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

      for (const { date, meals } of nutrients) {
        addToResult(date, {
          nutrients: sumNutrients(
            meals.map(meal => convertFoodNutrients(meal.nutrients)),
          ),
        });
      }

      const medicamentIntakes = await prisma.medicamentIntake.findMany({
        where: { date },
        ...MEDICAMENT_INTAKE_SELECTOR,
      });

      for (const medicamentIntake of medicamentIntakes) {
        addToResult(medicamentIntake.date, {
          medicamentIntake: convertMedicamentIntakeSelector(medicamentIntake),
        });
      }

      const cosmeticProductApplications = await prisma.cosmeticProductApplication
        .findMany({
          where: { day: { date } },
          ...COSMETIC_PRODUCT_APPLY_SELECTOR,
        })
        .then(items => items.map(convertCosmeticProductApplicationSelector));

      for (const cosmeticProductApplication of cosmeticProductApplications) {
        result[cosmeticProductApplication.date].cosmeticProductApplications.push(
          cosmeticProductApplication,
        );
      }

      return result;
    },
  }),

  'GET /days/:date': Controller.handler<GetDayRequest, GetDayResponse>({
    validator: z.object({
      date: CommonValidators.dateFormat,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
    }),
    handler: async (arg, { prisma }) => {
      const date = DateUtils.fromDateFormat(arg.date);

      const result: GetDayResponse = {
        date: arg.date,
        cosmeticProductApplications: [],
      };

      const weightData = await prisma.bodyStatistics.findFirst({
        ...BODY_WEIGHT_SELECTOR,
        where: { date },
      });

      result.weight = weightData?.weight;

      const nutrients = await prisma.foodTrackerDay.findFirst({
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

      result.nutrients = sumNutrients(
        nutrients?.meals.map(meal => convertFoodNutrients(meal.nutrients)) || [],
      );

      const medicamentIntakes = await prisma.medicamentIntake.findMany({
        where: { date },
        ...MEDICAMENT_INTAKE_SELECTOR,
      });

      result.medicamentIntakes = medicamentIntakes.map(convertMedicamentIntakeSelector);

      return result;
    },
  }),

  // Weight
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

  // Medicaments
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
    DeleteMedicamentInDateRequest,
    DeleteMedicamentInDateResponse
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

  // Female period
  'POST /days/:date/female-periods': Controller.handler<
    StartFemalePeriodRequest,
    StartFemalePeriodResponse
  >({
    validator: z.object({
      startDate: CommonValidators.dateFormat,
    }),
    parse: req => ({
      startDate: req.params.date as DateFormat,
    }),
    handler: async (arg, { prisma }) => {
      return await prisma.$transaction(async trx => {
        return await FemalePeriodService.create(arg.startDate, trx);
      });
    },
  }),

  'DELETE /days/:date/female-periods': Controller.handler<
    DeleteFemalePeriodRequest,
    DeleteFemalePeriodResponse
  >({
    validator: z.object({
      startDate: CommonValidators.dateFormat,
    }),
    parse: req => ({
      startDate: req.params.date as DateFormat,
    }),
    handler: async (arg, { prisma }) => {
      await prisma.$transaction(async trx => {
        await FemalePeriodService.delete(arg.startDate, trx);
      });
    },
  }),

  // Cosmetic
  'POST /days/:date/parts/:dayPartId/cosmetic/products/:productId': Controller.handler<
    AddCosmeticProductToDateRequest,
    AddCosmeticProductToDateResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      dayPartId: CommonValidators.id,
      cosmeticProductId: CommonValidators.id,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      dayPartId: req.params.dayPartId,
      cosmeticProductId: req.params.productId,
    }),
    handler: async ({ dayPartId, cosmeticProductId, date }, { prisma }) => {
      return await prisma.$transaction(async trx => {
        const day = await DayService.getDay(date, trx);

        return trx.cosmeticProductApplication
          .create({
            data: {
              dayId: day.id,
              dayPartId,
              cosmeticProductId,
            },
            ...COSMETIC_PRODUCT_APPLY_SELECTOR,
          })
          .then(convertCosmeticProductApplicationSelector);
      });
    },
  }),

  'DELETE /days/:date/parts/:dayPartId/cosmetic/products/:productId': Controller.handler<
    RemoveCosmeticProductFromDateRequest,
    RemoveCosmeticProductFromDateResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      dayPartId: CommonValidators.id,
      cosmeticProductId: CommonValidators.id,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      dayPartId: req.params.dayPartId,
      cosmeticProductId: req.params.productId,
    }),
    handler: async ({ dayPartId, cosmeticProductId, date }, { prisma }) => {
      await prisma.$transaction(async trx => {
        const day = await DayService.getDay(date, trx);

        await trx.cosmeticProductApplication.deleteMany({
          where: {
            dayId: day.id,
            dayPartId,
            cosmeticProductId,
          },
        });
      });
    },
  }),
});
