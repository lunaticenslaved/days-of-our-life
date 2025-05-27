import { Controller } from '#/server/utils/Controller';
import { z } from 'zod';

import * as NoteTypes from '#/shared/api/types/notes';
import { nonReachable } from '#/shared/utils';

const CreateValidator = z.object({
  action: z.literal('create'),
  data: z.object({
    products: z.array(
      z.object({
        grams: z.number().min(0),
        productId: z.string().uuid(),
      }),
    ),
    output: z.object({
      grams: z.number().min(0),
    }),
    title: z.string().max(255).optional(),
    recipeId: z.string().uuid().optional(),
  }),
});

export default new Controller<''>({
  'POST /': Controller.handler({
    validator: CreateValidator,
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
