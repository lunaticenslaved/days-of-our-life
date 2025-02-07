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
  AddFoodMealItemToDateRequest,
  AddFoodMealItemToDateResponse,
  UpdateFoodMealItemForDateRequest,
  UpdateFoodMealItemForDateResponse,
  RemoveFoodMealItemFromDateRequest,
  RemoveFoodMealItemFromDateResponse,
  ListFoodMealItemsForDateRequest,
  ListFoodMealItemsForDateResponse,
} from '#/shared/api/types/days';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayPart } from '#/shared/models/day';
import { BODY_WEIGHT_SELECTOR, convertBodyWeightSelector } from '#/server/selectors/body';
import { Controller } from '#/server/utils/Controller';
import { CommonValidators } from '#/shared/models/common';

import { convertDayPartSelector, DAY_PART_SELECTOR } from '#/server/selectors/days';
import {} from '#/shared/api/types/days';
import _ from 'lodash';

import { z } from 'zod';
import DayService from '#/server/services/DayService';
import {
  convertCosmeticProductApplicationSelector,
  COSMETIC_PRODUCT_APPLY_SELECTOR,
} from '#/server/selectors/cosmetic';
import FoodMealItemService from '#/server/services/food/FoodMealItemsService';

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
      const result = await DayService.list(
        {
          startDate: arg.startDate,
          endDate: arg.endDate,
        },
        prisma,
      );

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
      const result = await DayService.list(
        {
          startDate: arg.date,
          endDate: arg.date,
        },
        prisma,
      );

      return result[arg.date];
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
    handler: async ({ medicamentId, dayPartId, date }, { prisma }) => {
      return await prisma.$transaction(async trx => {
        const day = await DayService.getDay(date, trx);

        return await trx.medicamentIntake
          .create({
            ...MEDICAMENT_INTAKE_SELECTOR,
            data: {
              medicamentId,
              dayPartId,
              dayId: day.id,
            },
          })
          .then(convertMedicamentIntakeSelector);
      });
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
    handler: async ({ medicamentId, dayPartId, date }, { prisma }) => {
      await prisma.$transaction(async trx => {
        const day = await DayService.getDay(date, trx);

        await trx.medicamentIntake.deleteMany({
          where: {
            medicamentId,
            dayPartId,
            dayId: day.id,
          },
        });
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

  // Food
  'GET /days/:date/food/meal-items': Controller.handler<
    ListFoodMealItemsForDateRequest,
    ListFoodMealItemsForDateResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
    }),
    handler: async ({ date }, { prisma }) => {
      return await prisma.$transaction(async trx => {
        const day = await DayService.getDay(date, trx);

        return await FoodMealItemService.list({ dayId: day.id }, trx);
      });
    },
  }),

  'POST /days/:date/parts/:dayPartId/food/meal-items': Controller.handler<
    AddFoodMealItemToDateRequest,
    AddFoodMealItemToDateResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      dayPartId: CommonValidators.id,
      productId: CommonValidators.id,
      quantityConverterId: CommonValidators.id,
      quantity: CommonValidators.number({ min: 0 }),
      item: z
        .object({
          type: z.enum(['product']),
          productId: CommonValidators.id,
        })
        .or(
          z.object({
            type: z.enum(['recipe']),
            recipeId: CommonValidators.id,
          }),
        ),
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      dayPartId: req.params.dayPartId,
      item: req.body.item,
      quantity: req.body.quantity,
      quantityConverterId: req.body.quantityConverterId,
    }),
    handler: async (
      { dayPartId, date, quantity, quantityConverterId, item },
      { prisma },
    ) => {
      return await prisma.$transaction(async trx => {
        const day = await DayService.getDay(date, trx);

        return await FoodMealItemService.create(
          {
            dayPartId,
            dayId: day.id,
            food: item,
            quantity: {
              value: quantity,
              converterId: quantityConverterId,
            },
          },
          trx,
        );
      });
    },
  }),

  'PATCH /days/:date/parts/:dayPartId/food/meal-items/:mealItemId': Controller.handler<
    UpdateFoodMealItemForDateRequest,
    UpdateFoodMealItemForDateResponse
  >({
    validator: z.object({
      mealItemId: CommonValidators.id,
      date: CommonValidators.dateFormat,
      dayPartId: CommonValidators.id,
      productId: CommonValidators.id,
      quantityConverterId: CommonValidators.id,
      quantity: CommonValidators.number({ min: 0 }),
      item: z
        .object({
          type: z.enum(['product']),
          productId: CommonValidators.id,
        })
        .or(
          z.object({
            type: z.enum(['recipe']),
            recipeId: CommonValidators.id,
          }),
        ),
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      dayPartId: req.params.dayPartId,
      item: req.body.item,
      quantity: req.body.quantity,
      quantityConverterId: req.body.quantityConverterId,
      mealItemId: req.params.mealItemId,
    }),
    handler: async (
      { dayPartId, date, quantity, quantityConverterId, mealItemId, item },
      { prisma },
    ) => {
      return await prisma.$transaction(async trx => {
        const day = await DayService.getDay(date, trx);

        return await FoodMealItemService.update(
          {
            dayPartId,
            dayId: day.id,
            id: mealItemId,
            food: item,
            quantity: {
              value: quantity,
              converterId: quantityConverterId,
            },
          },
          trx,
        );
      });
    },
  }),

  'DELETE /days/:date/parts/:dayPartId/food/meal-items/:mealItemId': Controller.handler<
    RemoveFoodMealItemFromDateRequest,
    RemoveFoodMealItemFromDateResponse
  >({
    validator: z.object({
      mealItemId: CommonValidators.id,
      date: CommonValidators.dateFormat,
      dayPartId: CommonValidators.id,
    }),
    parse: req => ({
      date: req.params.date as DateFormat,
      dayPartId: req.params.dayPartId,
      mealItemId: req.params.mealItemId,
    }),
    handler: async ({ mealItemId }, { prisma }) => {
      await prisma.$transaction(async trx => {
        return await FoodMealItemService.delete({ id: mealItemId }, trx);
      });
    },
  }),
});
