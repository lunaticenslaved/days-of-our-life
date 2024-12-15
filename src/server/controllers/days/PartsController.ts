import {
  CreateDayPartRequest,
  CreateDayPartResponse,
  DeleteDayPartRequest,
  DeleteDayPartResponse,
  ListDayPartsRequest,
  ListDayPartsResponse,
  UpdateDayPartRequest,
  UpdateDayPartResponse,
  UpdateOrderDayPartRequest,
  UpdateOrderDayPartResponse,
} from '#/shared/api/types/days';
import { DayPart } from '#/shared/models/day';
import { Controller } from '#server/utils/Controller';

import { CommonValidators, DateFormat } from '#shared/models/common';
import { Prisma } from '@prisma/client';
import _ from 'lodash';

import { z } from 'zod';

export const SELECT_DAY_PART = {
  select: {
    id: true,
    name: true,
  },
} satisfies Prisma.DayPartDefaultArgs;

type DBDayPart = Prisma.DayPartGetPayload<typeof SELECT_DAY_PART>;

export function convertDayPart(data: DBDayPart): DayPart {
  return data;
}

export default new Controller<'days/parts'>({
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
          ...SELECT_DAY_PART,
        })
        .then(items => items.map(convertDayPart));
    },
  }),

  'POST /days/parts/orders': Controller.handler<
    UpdateOrderDayPartRequest,
    UpdateOrderDayPartResponse
  >({
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
          ...SELECT_DAY_PART,
        })
        .then(convertDayPart);
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
          ...SELECT_DAY_PART,
        })
        .then(convertDayPart);
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
});
