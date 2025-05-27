import { createApiAction } from '#/server/utils/api-action';
import { Action } from '#/shared/api/types';
import * as Food from '#/shared/api/types/food';

import { z } from 'zod';

createApiAction<Food.ProductComplex.CreateRequest, Food.ProductComplex.CreateResponse>({
  action: Action.Food_ProductComplex_Create,
  validator: z.object({
    action: z.literal(Action.Food_ProductComplex_Create),
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
      title: z.string().max(255),
      recipeId: z.string().uuid().optional(),
    }),
  }),
  handler: async ({ data }, { prisma }) => {
    const created = await prisma.foodProductComplex.create({
      data: {
        grams: data.output.grams,
        title: data.title,
        recipeId: data.recipeId,
        productBinds: {
          create: data.products.map(arg => {
            return {
              productId: arg.productId,
              grams: arg.grams,
            };
          }),
        },
      },
    });

    return {
      type: 'success',
      data: {
        id: created.id,
      },
    };
  },
});
