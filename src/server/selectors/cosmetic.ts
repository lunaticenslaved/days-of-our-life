import { Prisma } from '@prisma/client';
import {
  CosmeticIngredient,
  CosmeticProduct,
  CosmeticBenefit,
  CosmeticProductApplication,
  CosmeticRecipe,
  CosmeticRecipeComment,
  CosmeticINCIIngredient,
} from '#/shared/models/cosmetic';
import { DAY_SELECTOR } from '#/server/selectors/days';
import { DateUtils } from '#/shared/models/date';

export const COSMETIC_PRODUCT_SELECTOR = {
  select: {
    id: true,
    name: true,
    manufacturer: true,
  },
} satisfies Prisma.CosmeticProductDefaultArgs;

export const COSMETIC_PRODUCT_APPLY_SELECTOR = {
  select: {
    id: true,
    dayPartId: true,
    cosmeticProductId: true,
    day: DAY_SELECTOR,
  },
} satisfies Prisma.CosmeticProductApplicationDefaultArgs;

export const COSMETIC_INGREDIENT_SELECTOR = {
  select: {
    id: true,
    name: true,
    description: true,
    INCIs: {
      select: {
        id: true,
      },
    },
    benefits: {
      select: {
        id: true,
      },
    },
  },
} satisfies Prisma.CosmeticIngredientDefaultArgs;

export const COSMETIC_BENEFIT_SELECTOR = {
  select: {
    id: true,
    name: true,
    parentId: true,
  },
} satisfies Prisma.CosmeticBenefitDefaultArgs;

export function convertCosmeticProductApplicationSelector(
  data: Prisma.CosmeticProductApplicationGetPayload<
    typeof COSMETIC_PRODUCT_APPLY_SELECTOR
  >,
): CosmeticProductApplication {
  return {
    ...data,
    date: DateUtils.toDateFormat(data.day.date),
  };
}

export function convertCosmeticProductSelector(
  data: Prisma.CosmeticProductGetPayload<typeof COSMETIC_PRODUCT_SELECTOR>,
): CosmeticProduct {
  return data;
}

export function convertCosmeticIngredientSelector({
  benefits,
  INCIs,
  ...data
}: Prisma.CosmeticIngredientGetPayload<
  typeof COSMETIC_INGREDIENT_SELECTOR
>): CosmeticIngredient {
  return {
    ...data,
    INCIIngredientIds: INCIs.map(i => i.id),
    benefitIds: benefits.map(benefit => benefit.id),
  };
}

export function convertCosmeticBenefitSelector(
  data: Prisma.CosmeticBenefitGetPayload<typeof COSMETIC_BENEFIT_SELECTOR>,
): CosmeticBenefit {
  return { ...data, parentId: data.parentId || undefined };
}

/* ======================= Cosmetic Recipe START ======================= */
export const COSMETIC_RECIPE_SELECTOR = {
  select: {
    id: true,
    name: true,
    description: true,
    phases: {
      select: {
        name: true,
        ingredients: {
          select: {
            comment: true,
            percent: true,
            ingredientId: true,
          },
        },
      },
    },
  },
} satisfies Prisma.CosmeticRecipeDefaultArgs;

export function convertCosmeticRecipeSelector(
  data: Prisma.CosmeticRecipeGetPayload<typeof COSMETIC_RECIPE_SELECTOR>,
): CosmeticRecipe {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    phases: data.phases.map(phase => {
      return {
        name: phase.name,
        ingredients: phase.ingredients.map(ingredient => {
          return {
            percent: ingredient.percent,
            comment: ingredient.comment,
            ingredientId: ingredient.ingredientId,
          };
        }),
      };
    }),
  };
}
/* ======================= Cosmetic Recipe END ======================= */

/* 
======================================================================= 
======================= Cosmetic Recipe Comment ======================= 
======================================================================= 
*/
export const COSMETIC_RECIPE_COMMENT_SELECTOR = {
  select: {
    id: true,
    text: true,
    createdAt: true,
  },
} satisfies Prisma.CosmeticRecipeCommentDefaultArgs;

export function convertCosmeticRecipeCommentSelector(
  data: Prisma.CosmeticRecipeCommentGetPayload<typeof COSMETIC_RECIPE_COMMENT_SELECTOR>,
): CosmeticRecipeComment {
  return {
    id: data.id,
    text: data.text,
    createdAt: data.createdAt.toISOString(),
  };
}

/* 
======================================================================== 
======================= Cosmetic INCI Ingredient ======================= 
======================================================================== 
*/
export const COSMETIC_INCI_INGREDIENT_SELECTOR = {
  select: {
    id: true,
    name: true,
    benefits: {
      select: {
        id: true,
      },
    },
  },
} satisfies Prisma.CosmeticINCIIngredientDefaultArgs;

export function convertCosmeticINCIIngredientSelector(
  data: Prisma.CosmeticINCIIngredientGetPayload<typeof COSMETIC_INCI_INGREDIENT_SELECTOR>,
): CosmeticINCIIngredient {
  return {
    id: data.id,
    name: data.name,
    benefitIds: data.benefits.map(benefit => benefit.id),
  };
}
