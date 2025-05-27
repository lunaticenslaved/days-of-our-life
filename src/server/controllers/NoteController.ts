import { Controller } from '#/server/utils/Controller';
import { CommonValidators } from '#/shared/models/common';
import { z } from 'zod';

import * as NoteTypes from '#/shared/api/types/notes';
import { nonReachable } from '#/shared/utils';

export default new Controller<'notes'>({
  'POST /notes/create': Controller.handler<
    NoteTypes.CreateRequest,
    NoteTypes.CreateResponse
  >({
    validator: z.object({
      text: CommonValidators.str(2000),
      linkedTo: z.object({
        type: z.literal('food-recipe'),
        id: z.string(),
      }),
    }),
    parse: req => req.body,
    handler: async ({ text, linkedTo }, { prisma }) => {
      return await prisma.note
        .create({
          select,
          data: {
            text,
            ...parseLinkedTo(linkedTo),
          },
        })
        .then(data => {
          return {
            createdAt: data.createdAt.toISOString(),
            text: data.text,
            linkedTo,
          };
        });
    },
  }),
});

const select = {
  text: true,
  createdAt: true,
};

function parseLinkedTo(linkedTo: NoteTypes.CreateRequest['linkedTo']) {
  if (linkedTo.type === 'food-recipe') {
    return {
      foodRecipeId: linkedTo.id,
    };
  }

  nonReachable(linkedTo.type);
}
