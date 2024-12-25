import { convertCosmeticProductSelector, COSMETIC_PRODUCT_SELECTOR } from './cosmetic';
import { DayPart } from '#/shared/models/day';
import { Prisma } from '@prisma/client';
import { CosmeticProductApply } from '#/shared/models/cosmetic';
import { DateUtils } from '#/shared/models/date';

export const DAY_PART_SELECTOR = {
  select: {
    id: true,
    name: true,
    order: true,
  },
} satisfies Prisma.DayPartDefaultArgs;

export function convertDayPartSelector(
  data: Prisma.DayPartGetPayload<typeof DAY_PART_SELECTOR>,
): DayPart {
  return data;
}

export const COSMETIC_PRODUCT_APPLY_SELECTOR = {
  select: {
    id: true,
    date: true,
    dayPartId: true,
    cosmeticProduct: COSMETIC_PRODUCT_SELECTOR,
  },
} satisfies Prisma.CosmeticProductApplyDefaultArgs;

export function convertCosmeticProductApplySelector(
  data: Prisma.CosmeticProductApplyGetPayload<typeof COSMETIC_PRODUCT_APPLY_SELECTOR>,
): CosmeticProductApply {
  return {
    ...data,
    date: DateUtils.toDateFormat(data.date),
    cosmeticProduct: convertCosmeticProductSelector(data.cosmeticProduct),
  };
}
