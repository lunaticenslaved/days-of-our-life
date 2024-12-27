import { DayPart } from '#/shared/models/day';
import { Prisma } from '@prisma/client';
import { CosmeticProductApplication } from '#/shared/models/cosmetic';
import { DateUtils } from '#/shared/models/date';

export const DAY_PART_SELECTOR = {
  select: {
    id: true,
    name: true,
    order: true,
  },
} satisfies Prisma.DayPartDefaultArgs;

export const DAY_SELECTOR = {
  select: {
    id: true,
    date: true,
  },
} satisfies Prisma.DayDefaultArgs;

export function convertDayPartSelector(
  data: Prisma.DayPartGetPayload<typeof DAY_PART_SELECTOR>,
): DayPart {
  return data;
}

export const COSMETIC_PRODUCT_APPLY_SELECTOR = {
  select: {
    id: true,
    dayPartId: true,
    cosmeticProductId: true,
    day: DAY_SELECTOR,
  },
} satisfies Prisma.CosmeticProductApplicationDefaultArgs;

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
