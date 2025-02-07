import { DateUtils } from '#/shared/models/date';
import {
  FoodProduct,
  FoodRecipe,
  FoodMealItem,
  FoodNutrients,
} from '#/shared/models/food';
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

/**  It's important to not return id, createdAt, updatedAt and other fields*/
export const ONLY_NUTRIENTS_SELECT = NUTRIENTS_SELECT;

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
    quantities: {
      ...QUANTITY_CONVERTER,
      where: { isDeleted: false },
    },
    nutrientsPerGram: NUTRIENTS_SELECT,
  },
} satisfies Prisma.FoodRecipeDefaultArgs;

export const SELECT_PRODUCT = {
  select: {
    id: true,
    name: true,
    manufacturer: true,
    nutrientsPerGram: NUTRIENTS_SELECT,
    quantities: {
      ...QUANTITY_CONVERTER,
      where: { isDeleted: false },
    },
  },
} satisfies Prisma.FoodProductDefaultArgs;

export const FOOD_MEAL_ITEM_SELECTOR = {
  select: {
    id: true,
    productId: true,
    recipeId: true,
    nutrients: NUTRIENTS_SELECT,
    quantity: true,
    quantityConverterId: true,
    dayPartId: true,
    day: {
      select: {
        id: true,
        date: true,
      },
    },
  },
} satisfies Prisma.FoodMealItemDefaultArgs;

type DBFoodNutrients = Prisma.FoodNutrientsGetPayload<typeof ONLY_NUTRIENTS_SELECT>;
type DBFoodRecipe = Prisma.FoodRecipeGetPayload<typeof SELECT_RECIPE>;
type DBFoodProduct = Prisma.FoodProductGetPayload<typeof SELECT_PRODUCT>;
type DBFoodMealItem = Prisma.FoodMealItemGetPayload<typeof FOOD_MEAL_ITEM_SELECTOR>;

export function convertFoodNutrients(data: DBFoodNutrients): FoodNutrients {
  return data;
}

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
    nutrientsPerGram: convertFoodNutrients(data.nutrientsPerGram),
    quantities: data.quantities,
  };
}

export function convertFoodProduct(data: DBFoodProduct): FoodProduct {
  return {
    id: data.id,
    name: data.name,
    manufacturer: data.manufacturer || undefined,
    nutrientsPerGram: convertFoodNutrients(data.nutrientsPerGram),
    quantities: data.quantities,
  };
}

export function convertFoodMealItemSelector(data: DBFoodMealItem): FoodMealItem {
  let food: FoodMealItem['food'] | undefined = undefined;

  if (data.productId) {
    food = {
      type: 'product',
      productId: data.productId,
    };
  } else if (data.recipeId) {
    food = {
      type: 'recipe',
      recipeId: data.recipeId,
    };
  }

  if (!food) {
    throw new Error('Unknown source');
  }

  return {
    id: data.id,
    quantity: {
      value: data.quantity,
      converterId: data.quantityConverterId,
    },
    nutrients: data.nutrients,
    date: DateUtils.toDateFormat(data.day.date),
    dayPartId: data.dayPartId,
    food,
  };
}
