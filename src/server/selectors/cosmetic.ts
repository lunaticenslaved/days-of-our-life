import { Prisma } from '@prisma/client';
import {
  CosmeticIngredient,
  CosmeticProduct,
  CosmeticIngredientBenefit,
  CosmeticProductApplication,
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
  },
} satisfies Prisma.CosmeticIngredientDefaultArgs;

export const COSMETIC_INGREDIENT_BENEFIT_SELECTOR = {
  select: {
    id: true,
    name: true,
    parentId: true,
  },
} satisfies Prisma.CosmeticIngredientBenefitDefaultArgs;

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

export function convertCosmeticIngredientSelector(
  data: Prisma.CosmeticIngredientGetPayload<typeof COSMETIC_INGREDIENT_SELECTOR>,
): CosmeticIngredient {
  return { ...data };
}

export function convertCosmeticIngredientBenefitSelector(
  data: Prisma.CosmeticIngredientBenefitGetPayload<
    typeof COSMETIC_INGREDIENT_BENEFIT_SELECTOR
  >,
): CosmeticIngredientBenefit {
  return { ...data, parentId: data.parentId || undefined };
}
