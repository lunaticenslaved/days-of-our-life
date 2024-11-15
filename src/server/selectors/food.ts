import {
  FoodTrackerDay,
  FoodProduct,
  FoodRecipe,
  FoodTrackerMealItem,
} from '#shared/models/food';
import { Prisma } from '@prisma/client';

const QUANTITY_CONVERTER = {
  select: {
    id: true,
    grams: true,
    name: true,
  },
} satisfies Prisma.FoodQuantityConverterDefaultArgs;

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
    output: {
      select: {
        grams: true,
        servings: true,
      },
    },
    quantities: QUANTITY_CONVERTER,
    nutrientsPerGram: NUTRIENTS_SELECT,
  },
} satisfies Prisma.FoodRecipeDefaultArgs;

export const SELECT_PRODUCT = {
  select: {
    id: true,
    name: true,
    manufacturer: true,
    nutrientsPerGram: NUTRIENTS_SELECT,
    quantities: QUANTITY_CONVERTER,
  },
} satisfies Prisma.FoodProductDefaultArgs;

export const SELECT_MEAL_ITEM = {
  select: {
    id: true,
    quantity: true,
    product: { select: { id: true, name: true, manufacturer: true } },
    recipe: { select: { id: true, name: true } },
    nutrients: NUTRIENTS_SELECT,
    quantityConverter: QUANTITY_CONVERTER,
  },
} satisfies Prisma.FoodTrackerMealItemDefaultArgs;

export const SELECT_TRACKER_DAY = {
  select: {
    id: true,
    date: true,
    meals: {
      ...SELECT_MEAL_ITEM,
      orderBy: [{ createdAt: 'asc' }],
    },
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
    quantities: data.quantities,
  };
}

export function convertFoodProduct(data: DBFoodProduct): FoodProduct {
  return {
    id: data.id,
    name: data.name,
    manufacturer: data.manufacturer || undefined,
    nutrientsPerGram: data.nutrientsPerGram,
    quantities: data.quantities,
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
    nutrients: data.nutrients,
    quantityConverter: data.quantityConverter,
    source,
  };
}

export function convertFoodTrackerDay(data: DBFoodTrackerDay): FoodTrackerDay {
  return {
    id: data.id,
    date: data.date.toISOString(),
    meals: data.meals.length
      ? [{ items: data.meals.map(convertFoodTrackerMealItem) }]
      : [],
  };
}
