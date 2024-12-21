import {
  convertMedicamentIntakeSelector,
  convertMedicamentSelector,
  MEDICAMENT_INTAKE_SELECTOR,
  MEDICAMENT_SELECTOR,
} from '#/server/selectors/medicaments';
import {
  CreateMedicamentIntakeRequest,
  CreateMedicamentIntakeResponse,
  CreateMedicamentRequest,
  CreateMedicamentResponse,
  DeleteMedicamentIntakeRequest,
  DeleteMedicamentIntakeResponse,
  DeleteMedicamentRequest,
  DeleteMedicamentResponse,
  ListMedicamentIntakesRequest,
  ListMedicamentIntakesResponse,
  ListMedicamentsRequest,
  ListMedicamentsResponse,
  UpdateMedicamentIntakeRequest,
  UpdateMedicamentIntakeResponse,
  UpdateMedicamentRequest,
  UpdateMedicamentResponse,
} from '#/shared/api/types/medicaments';
import { CommonValidators } from '#/shared/models/common';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { Controller } from '#server/utils/Controller';

import _ from 'lodash';

import { z } from 'zod';

export default new Controller<'medicaments'>({
  'GET /medicaments': Controller.handler<ListMedicamentsRequest, ListMedicamentsResponse>(
    {
      validator: z.object({}),
      parse: _req => ({}),
      handler: async (_, { prisma }) => {
        return prisma.medicament
          .findMany({
            orderBy: { name: 'asc' },
            ...MEDICAMENT_SELECTOR,
          })
          .then(items => items.map(convertMedicamentSelector));
      },
    },
  ),

  'POST /medicaments': Controller.handler<
    CreateMedicamentRequest,
    CreateMedicamentResponse
  >({
    validator: z.object({
      name: CommonValidators.str(255),
    }),
    parse: req => ({
      name: req.body.name,
    }),
    handler: async ({ name }, { prisma }) => {
      return prisma.medicament
        .create({
          data: {
            name,
          },
          ...MEDICAMENT_SELECTOR,
        })
        .then(convertMedicamentSelector);
    },
  }),

  'PATCH /medicaments/:id': Controller.handler<
    UpdateMedicamentRequest,
    UpdateMedicamentResponse
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
      return prisma.medicament
        .update({
          where: {
            id,
          },
          data: {
            name,
          },
          ...MEDICAMENT_SELECTOR,
        })
        .then(convertMedicamentSelector);
    },
  }),

  'DELETE /medicaments/:id': Controller.handler<
    DeleteMedicamentRequest,
    DeleteMedicamentResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      await prisma.$transaction(async trx => {
        const existingIntake = await trx.medicamentIntake.findFirst({
          where: { medicamentId: id },
        });

        if (existingIntake) {
          await trx.medicament.update({
            where: { id },
            data: {
              isDeleted: true,
            },
          });
        } else {
          await trx.medicament.deleteMany({
            where: { id },
          });
        }
      });
    },
  }),

  'POST /medicaments/:id/intakes': Controller.handler<
    CreateMedicamentIntakeRequest,
    CreateMedicamentIntakeResponse
  >({
    validator: z.object({
      medicamentId: CommonValidators.id,
      dayPartId: CommonValidators.id,
      date: CommonValidators.dateFormat,
    }),
    parse: req => ({
      medicamentId: req.params.id,
      dayPartId: req.body.dayPartId,
      date: req.body.date,
    }),
    handler: async ({ medicamentId, dayPartId, date }, { prisma }) => {
      return prisma.medicamentIntake
        .create({
          data: {
            medicamentId,
            dayPartId,
            date: DateUtils.fromDateFormat(date),
          },
          ...MEDICAMENT_INTAKE_SELECTOR,
        })
        .then(convertMedicamentIntakeSelector);
    },
  }),

  'GET /medicaments/intakes': Controller.handler<
    ListMedicamentIntakesRequest,
    ListMedicamentIntakesResponse
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

      return prisma.medicamentIntake
        .findMany({
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          ...MEDICAMENT_INTAKE_SELECTOR,
        })
        .then(items => items.map(convertMedicamentIntakeSelector));
    },
  }),

  'DELETE /medicaments/intakes/:id': Controller.handler<
    DeleteMedicamentIntakeRequest,
    DeleteMedicamentIntakeResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
    }),
    parse: req => ({
      id: req.params.id,
    }),
    handler: async ({ id }, { prisma }) => {
      await prisma.medicamentIntake.deleteMany({
        where: { id },
      });
    },
  }),

  'PATCH /medicaments/intakes/:id': Controller.handler<
    UpdateMedicamentIntakeRequest,
    UpdateMedicamentIntakeResponse
  >({
    validator: z.object({
      id: CommonValidators.id,
      medicamentId: CommonValidators.id,
      dayPartId: CommonValidators.id,
      date: CommonValidators.dateFormat,
    }),
    parse: req => ({
      id: req.params.id,
      medicamentId: req.body.medicamentId,
      dayPartId: req.body.dayPartId,
      date: req.body.date,
    }),
    handler: async ({ id, medicamentId, dayPartId, date }, { prisma }) => {
      return await prisma.medicamentIntake
        .update({
          where: { id },
          data: {
            medicamentId,
            dayPartId,
            date: DateUtils.fromDateFormat(date),
          },
          ...MEDICAMENT_INTAKE_SELECTOR,
        })
        .then(convertMedicamentIntakeSelector);
    },
  }),
});
