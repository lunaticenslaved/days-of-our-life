import { convertFoodRecipe, SELECT_RECIPE } from '#server/selectors/food';
import { PrismaTransaction } from '#server/prisma';
import { Controller } from '#server/utils/Controller';
import {
  CreateFoodRecipeRequest,
  CreateFoodRecipeResponse,
  DeleteFoodRecipeRequest,
  DeleteFoodRecipeResponse,
  GetFoodRecipeRequest,
  GetFoodRecipeResponse,
  ListFoodRecipesRequest,
  ListFoodRecipesResponse,
  UpdateFoodRecipeRequest,
  UpdateFoodRecipeResponse,
} from '#shared/api/types/food';
import _ from 'lodash';
import { FoodValidators } from '#shared/models/food';
import { z } from 'zod';
import { CommonValidators } from '#shared/models/common';
import FoodNutrientsService from '#server/services/FoodNutrientsService';

async function insertParts(
  { id: recipeId, parts }: Pick<UpdateFoodRecipeRequest, 'parts' | 'id'>,
  trx: PrismaTransaction,
) {
  await trx.foodRecipePart.deleteMany({ where: { recipeId } });

  for (const part of parts) {
    const { id: recipePartId } = await trx.foodRecipePart.create({
      data: {
        recipeId,
        title: part.title,
        description: part.description,
      },
    });

    for (const { grams, productId, description } of part.ingredients) {
      await trx.foodRecipeIngredient.create({
        data: { recipePartId, productId, grams, description },
      });
    }
  }
}

const CreateFoodRecipeRequestValidator: z.ZodType<CreateFoodRecipeRequest> = z.object({
  name: FoodValidators.name,
  description: FoodValidators.recipeDescription,
  output: FoodValidators.recipeOutput,
  parts: FoodValidators.recipeParts,
});

export default new Controller<'food/recipes'>({
  'GET /food/recipes': Controller.handler<
    ListFoodRecipesRequest,
    ListFoodRecipesResponse
  >({
    validator: z.object({}),
    parse: () => ({}),
    handler: async (_, { prisma }) => {
      return await prisma.foodRecipe
        .findMany({ ...SELECT_RECIPE })
        .then(data => data.map(convertFoodRecipe));
    },
  }),

  'GET /food/recipes/:recipeId': Controller.handler<
    GetFoodRecipeRequest,
    GetFoodRecipeResponse
  >({
    validator: z.object({ id: CommonValidators.id }),
    parse: req => ({ id: req.params.recipeId }),
    handler: async ({ id }, { prisma }) => {
      return prisma.foodRecipe
        .findFirstOrThrow({
          where: { id },
          ...SELECT_RECIPE,
        })
        .then(convertFoodRecipe);
    },
  }),

  'POST /food/recipes': Controller.handler<
    CreateFoodRecipeRequest,
    CreateFoodRecipeResponse
  >({
    validator: CreateFoodRecipeRequestValidator,
    parse: req => ({ ...req.body }),
    handler: async ({ name, description, output, parts }, { prisma }) => {
      return prisma.$transaction(async trx => {
        const nutrients = await FoodNutrientsService.calculate(
          _.flatMap(parts, p => p.ingredients),
          trx,
        );

        const { id: recipeId } = await trx.foodRecipe.create({
          data: {
            name,
            description,
            nutrientsPerGram: {
              create: FoodNutrientsService.divide(nutrients, output.grams),
            },
            output: {
              create: output,
            },
          },
          select: {
            id: true,
          },
        });

        await insertParts({ id: recipeId, parts }, trx);

        return await trx.foodRecipe
          .findFirstOrThrow({
            where: { id: recipeId },
            ...SELECT_RECIPE,
          })
          .then(convertFoodRecipe);
      });
    },
  }),

  'PATCH /food/recipes/:recipeId': Controller.handler<
    UpdateFoodRecipeRequest,
    UpdateFoodRecipeResponse
  >({
    validator: CreateFoodRecipeRequestValidator.and(
      z.object({ id: CommonValidators.id }),
    ),
    parse: req => ({ ...req.body, id: req.params.recipeId }),
    handler: async ({ name, description, output, parts, id }, { prisma }) => {
      return prisma.$transaction(async trx => {
        const nutrients = await FoodNutrientsService.calculate(
          _.flatMap(parts, p => p.ingredients),
          trx,
        );

        await trx.foodRecipe.update({
          where: { id },
          data: {
            name,
            description,
            nutrientsPerGram: {
              update: FoodNutrientsService.divide(nutrients, output.grams),
            },
            output: {
              update: output,
            },
          },
        });

        await insertParts({ id, parts }, trx);

        return await trx.foodRecipe
          .findFirstOrThrow({
            where: { id },
            ...SELECT_RECIPE,
          })
          .then(convertFoodRecipe);
      });
    },
  }),

  'DELETE /food/recipes/:productId': Controller.handler<
    DeleteFoodRecipeRequest,
    DeleteFoodRecipeResponse
  >({
    validator: z.object({ id: CommonValidators.id }),
    parse: req => ({ id: req.params.recipeId }),
    handler: async ({ id }, { prisma }) => {
      await prisma.foodRecipe.update({
        where: { id },
        data: { isDeleted: true },
      });
    },
  }),
});
