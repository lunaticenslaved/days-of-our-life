import {
  FoodTrackerDay,
  FoodProduct,
  FoodRecipe,
  FoodQuantityType,
  FoodTrackerMealItem,
} from '#shared/models/food';
import { Prisma } from '@prisma/client';

const NUTRIENTS_SELECT = {
  select: {
    calories: true,
    carbs: true,
    proteins: true,
    fats: true,
    fibers: true,
  },
} satisfies Prisma.FoodNutrientsDefaultArgs;

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
    output: true,
    nutrientsPerGram: NUTRIENTS_SELECT,
  },
} satisfies Prisma.FoodRecipeDefaultArgs;

export const SELECT_PRODUCT = {
  select: {
    id: true,
    name: true,
    manufacturer: true,
    nutrientsPerGram: NUTRIENTS_SELECT,
  },
} satisfies Prisma.FoodProductDefaultArgs;

export const SELECT_MEAL_ITEM = {
  select: {
    id: true,
    quantity: true,
    quantityType: true,
    product: { select: { id: true, name: true, manufacturer: true } },
    recipe: { select: { id: true, name: true } },
    nutrients: NUTRIENTS_SELECT,
  },
} satisfies Prisma.FoodTrackerMealItemDefaultArgs;

export const SELECT_TRACKER_DAY = {
  select: {
    id: true,
    date: true,
    meals: SELECT_MEAL_ITEM,
  },
} satisfies Prisma.FoodTrackerDayDefaultArgs;

type DBFoodRecipe = Prisma.FoodRecipeGetPayload<typeof SELECT_RECIPE>;
type DBFoodProduct = Prisma.FoodProductGetPayload<typeof SELECT_PRODUCT>;
type DBFoodTrackerDay = Prisma.FoodTrackerDayGetPayload<typeof SELECT_TRACKER_DAY>;
type DBFoodTrackerMealItem = Prisma.FoodTrackerMealItemGetPayload<
  typeof SELECT_MEAL_ITEM
>;

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
    output: data.output,
    nutrientsPerGram: data.nutrientsPerGram,
  };
}

export function convertFoodProduct(data: DBFoodProduct): FoodProduct {
  return {
    id: data.id,
    name: data.name,
    manufacturer: data.manufacturer || undefined,
    nutrientsPerGram: data.nutrientsPerGram,
  };
}

export function convertFoodTrackerMealItem(
  data: DBFoodTrackerMealItem,
): FoodTrackerMealItem {
  let source: FoodTrackerMealItem['source'] | undefined = undefined;

  if (data.product) {
    source = {
      type: 'product',
      product: data.product,
    };
  } else if (data.recipe) {
    source = {
      type: 'recipe',
      recipe: data.recipe,
    };
  }

  if (!source) {
    throw new Error('Unknown source');
  }

  return {
    id: data.id,
    quantity: data.quantity,
    quantityType: data.quantityType as FoodQuantityType,
    nutrients: data.nutrients,
    source,
  };
}

export function convertFoodTrackerDay(data: DBFoodTrackerDay): FoodTrackerDay {
  return {
    id: data.id,
    date: data.date.toISOString(),
    meals: [{ items: data.meals.map(convertFoodTrackerMealItem) }],
  };
}
