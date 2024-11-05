import {
  convertFoodProduct,
  convertFoodRecipe,
  SELECT_PRODUCT,
  SELECT_RECIPE,
} from '#server/models/food';
import { PrismaTransaction } from '#server/prisma';
import { Controller } from '#server/utils/Controller';
import { ValidationError } from '#shared/errors';
import { FoodRecipe, FoodRecipeStatsType } from '#shared/models/FoodRecipe';
import { nonReachable } from '#shared/utils';
import _ from 'lodash';

interface RecipeId {
  recipeId: string;
}
interface VersionId {
  versionId: string;
}

interface CreateRecipeRequest extends RecipeId {
  name: string;
  description: string;
  stats: Array<{
    type: FoodRecipeStatsType;
    quantity: number;
  }>;
  parts: Array<{
    title: string;
    description?: string;
    ingredients: Array<{
      grams: number;
      productId: string;
      description?: string;
    }>;
  }>;
}

interface UpdateRecipeRequest extends CreateRecipeRequest, VersionId {}

async function insertStats(
  { recipeId, parts, stats }: Pick<CreateRecipeRequest, 'parts' | 'stats'> & RecipeId,
  trx: PrismaTransaction,
) {
  if (stats.length === 0) {
    throw new ValidationError({
      status: 400,
      errors: ['At least one stat is required'],
    });
  }

  let calories = 0;
  let fats = 0;
  let proteins = 0;
  let carbs = 0;

  const ingredients = _.flatMap(parts, p => p.ingredients);

  const products = await trx.foodProduct
    .findMany({
      where: {
        id: {
          in: ingredients.map(({ productId }) => productId),
        },
      },
      ...SELECT_PRODUCT,
    })
    .then(data => data.map(convertFoodProduct));

  for (const { nutrients, id: productId } of products) {
    const ingredient = ingredients.find(i => i.productId === productId);

    if (!ingredient) {
      throw new Error('Unknown ingredient');
    }

    const { grams } = ingredient;

    calories += (nutrients.calories / 100) * grams;
    fats += (nutrients.fats / 100) * grams;
    proteins += (nutrients.proteins / 100) * grams;
    carbs += (nutrients.carbs / 100) * grams;
  }

  await trx.foodRecipeStats.deleteMany({
    where: { recipeId },
  });

  for (const { type, quantity } of stats) {
    let convert = (value: number) => value;

    if (type === 'grams') {
      convert = value => (value / quantity) * 100;
    } else if (type === 'servings') {
      convert = value => value / quantity;
    } else {
      nonReachable(type);
    }

    await trx.foodRecipeStats.create({
      data: {
        recipeId,
        type,
        quantity,
        nutrients: {
          create: {
            calories: convert(calories),
            fats: convert(fats),
            proteins: convert(proteins),
            carbs: convert(carbs),
          },
        },
      },
    });
  }
}

async function insertParts(
  { recipeId, parts }: Pick<CreateRecipeRequest, 'parts'> & RecipeId,
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

export default new Controller<'food/recipes'>({
  'GET /food/recipes': Controller.handler<void, FoodRecipe[]>({
    parse: () => {},
    handler: async (_, { prisma }) => {
      return prisma.foodRecipe
        .findMany({ ...SELECT_RECIPE })
        .then(data => data.map(convertFoodRecipe));
    },
  }),

  'GET /food/recipes/:recipeId': Controller.handler<RecipeId, FoodRecipe>({
    parse: req => ({ recipeId: req.params.recipeId }),
    handler: async ({ recipeId }, { prisma }) => {
      return prisma.foodRecipe
        .findFirstOrThrow({
          where: { id: recipeId },
          ...SELECT_RECIPE,
        })
        .then(convertFoodRecipe);
    },
  }),

  'POST /food/recipes': Controller.handler<CreateRecipeRequest, FoodRecipe>({
    parse: req => ({ ...req.body }),
    handler: async ({ name, description, stats, parts }, { prisma }) => {
      return prisma.$transaction(async trx => {
        const { id: recipeId } = await trx.foodRecipe.create({
          data: {
            name,
            description,
          },
          select: {
            id: true,
          },
        });

        await insertStats({ recipeId, stats, parts }, trx);
        await insertParts({ recipeId, parts }, trx);

        return await trx.foodRecipe
          .findFirstOrThrow({
            where: { id: recipeId },
            ...SELECT_RECIPE,
          })
          .then(convertFoodRecipe);
      });
    },
  }),

  'PATCH /food/recipes/:recipeId': Controller.handler<UpdateRecipeRequest, FoodRecipe>({
    parse: req => ({
      ...req.body,
      recipeId: req.params.recipeId,
    }),
    handler: async ({ name, description, stats, parts, recipeId }, { prisma }) => {
      return prisma.$transaction(async trx => {
        await trx.foodRecipe.update({
          where: { id: recipeId },
          data: { name, description },
        });

        await insertStats({ recipeId, stats, parts }, trx);
        await insertParts({ recipeId, parts }, trx);

        return await trx.foodRecipe
          .findFirstOrThrow({
            where: { id: recipeId },
            ...SELECT_RECIPE,
          })
          .then(convertFoodRecipe);
      });
    },
  }),

  'DELETE /food/recipes/:productId': Controller.handler<RecipeId, void>({
    parse: req => ({ recipeId: req.params.recipeId }),
    handler: async ({ recipeId }, { prisma }) => {
      await prisma.foodRecipe.update({
        where: { id: recipeId },
        data: { isDeleted: true },
      });
    },
  }),
});
