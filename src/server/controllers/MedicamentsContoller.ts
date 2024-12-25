import {
  convertMedicamentSelector,
  MEDICAMENT_SELECTOR,
} from '#/server/selectors/medicaments';
import {
  CreateMedicamentRequest,
  CreateMedicamentResponse,
  DeleteMedicamentRequest,
  DeleteMedicamentResponse,
  ListMedicamentsRequest,
  ListMedicamentsResponse,
  UpdateMedicamentRequest,
  UpdateMedicamentResponse,
} from '#/shared/api/types/medicaments';
import { CommonValidators } from '#/shared/models/common';
import { Controller } from '#/server/utils/Controller';

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
});
