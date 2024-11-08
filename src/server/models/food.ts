import { FoodProduct } from '#shared/models/FoodProduct';
import { FoodRecipe, FoodRecipeStatsType } from '#shared/models/FoodRecipe';
import { Prisma } from '@prisma/client';

const NUTRIENTS_SELECT = {
  select: {
    calories: true,
    carbs: true,
    proteins: true,
    fats: true,
    fibers: true,
  },
};

export const SELECT_RECIPE = {
  select: {
    id: true,
    name: true,
    description: true,
    parts: {
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: {
          select: {
            id: true,
            grams: true,
            description: true,
            product: {
              select: {
                id: true,
                name: true,
                manufacturer: true,
              },
            },
          },
        },
      },
    },
    stats: {
      select: {
        type: true,
        quantity: true,
        nutrients: NUTRIENTS_SELECT,
      },
    },
  },
} satisfies Prisma.FoodRecipeDefaultArgs;

export const SELECT_PRODUCT = {
  select: {
    id: true,
    name: true,
    manufacturer: true,
    nutrients: NUTRIENTS_SELECT,
  },
} satisfies Prisma.FoodProductDefaultArgs;

export type DBFoodRecipe = Prisma.FoodRecipeGetPayload<typeof SELECT_RECIPE>;
export type DBFoodProduct = Prisma.FoodProductGetPayload<typeof SELECT_PRODUCT>;

export function convertFoodRecipe(data: DBFoodRecipe): FoodRecipe {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    parts: data.parts.map(part => {
      return {
        id: part.id,
        title: part.title,
        description: part.description || undefined,
        ingredients: part.ingredients.map(({ id, grams, product, description }) => {
          return {
            id,
            grams,
            description: description || undefined,
            product: {
              id: product.id,
              name: product.name,
              manufacturer: product.manufacturer || undefined,
            },
          };
        }),
      };
    }),
    stats: data.stats.map(({ nutrients, ...stat }) => {
      if (!nutrients) {
        throw new Error('No nutrients on stats');
      }

      return {
        ...stat,
        nutrients,
        type: stat.type as FoodRecipeStatsType,
      };
    }),
  };
}

export function convertFoodProduct({ nutrients, ...data }: DBFoodProduct): FoodProduct {
  if (!nutrients) {
    throw new Error('No nutrients on stats');
  }

  return {
    id: data.id,
    name: data.name,
    manufacturer: data.manufacturer || undefined,
    nutrients,
  };
}
