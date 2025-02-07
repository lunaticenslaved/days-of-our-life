import { Controller } from '#/server/utils/Controller';

import _ from 'lodash';

import { z } from 'zod';
import {
  CreateFoodMealItemRequest,
  CreateFoodMealItemResponse,
  DeleteFoodMealItemRequest,
  DeleteFoodMealItemResponse,
  GetFoodMealItemRequest,
  GetFoodMealItemResponse,
  ListFoodMealItemsRequest,
  ListFoodMealItemsResponse,
  UpdateFoodMealItemRequest,
  UpdateFoodMealItemResponse,
} from '#/shared/api/types/food';
import { CommonValidators } from '#/shared/models/common';
import { DateFormat } from '#/shared/models/date';
import FoodMealItemsService from '#/server/services/food/FoodMealItemsService';
import DayService from '#/server/services/DayService';
import { FoodMealItemValidators, FoodValidators } from '#/shared/models/food';

export default new Controller<'food/meal-items'>({
  'GET /food/meal-items': Controller.handler<
    ListFoodMealItemsRequest,
    ListFoodMealItemsResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
    }),
    parse: req => ({
      date: req.query.date as DateFormat,
    }),
    handler: async ({ date }, { prisma }) => {
      const day = await DayService.getDay(date, prisma);

      return FoodMealItemsService.list({ dayId: day.id }, prisma);
    },
  }),

  'POST /food/meal-items': Controller.handler<
    CreateFoodMealItemRequest,
    CreateFoodMealItemResponse
  >({
    validator: z.object({
      date: CommonValidators.dateFormat,
      dayPartId: CommonValidators.id,
      food: FoodMealItemValidators.food,
      quantity: z.object({
        value: FoodValidators.quantity,
        converterId: FoodValidators.quantityConverterId,
      }),
    }),
    parse: req => ({
      date: req.body.date as DateFormat,
      dayPartId: req.body.dayPartId,
      food: req.body.food,
      quantity: req.body.quantity,
    }),
    handler: async ({ date, ...data }, { prisma }) => {
      const day = await DayService.getDay(date, prisma);

      return FoodMealItemsService.create({ dayId: day.id, ...data }, prisma);
    },
  }),

  'PATCH /food/meal-items/:id': Controller.handler<
    UpdateFoodMealItemRequest,
    UpdateFoodMealItemResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
      date: CommonValidators.dateFormat,
      dayPartId: CommonValidators.id,
      food: FoodMealItemValidators.food,
      quantity: z.object({
        value: FoodValidators.quantity,
        converterId: FoodValidators.quantityConverterId,
      }),
    }),
    parse: req => ({
      id: req.params.id,
      date: req.body.date as DateFormat,
      dayPartId: req.body.dayPartId,
      food: req.body.food,
      quantity: req.body.quantity,
    }),
    handler: async ({ date, ...data }, { prisma }) => {
      const day = await DayService.getDay(date, prisma);

      return FoodMealItemsService.update({ dayId: day.id, ...data }, prisma);
    },
  }),

  'DELETE /food/meal-items/:id': Controller.handler<
    DeleteFoodMealItemRequest,
    DeleteFoodMealItemResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      return FoodMealItemsService.delete({ id }, prisma);
    },
  }),

  'GET /food/meal-items/:id': Controller.handler<
    GetFoodMealItemRequest,
    GetFoodMealItemResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      return FoodMealItemsService.get({ id }, prisma);
    },
  }),
});
