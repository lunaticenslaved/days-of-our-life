import { DayInfo, DayPart } from '#/shared/models/day';
import { Prisma } from '@prisma/client';
import {
  convertMedicamentIntakeSelector,
  MEDICAMENT_INTAKE_SELECTOR,
} from '#/server/selectors/medicaments';
import {
  convertCosmeticProductApplicationSelector,
  COSMETIC_PRODUCT_APPLY_SELECTOR,
} from '#/server/selectors/cosmetic';
import { DateUtils } from '#/shared/models/date';
import {
  convertFemalePeriodSelector,
  FEMALE_PERIOD_SELECTOR,
} from '#/server/selectors/female-period';
import { FOOD_MEAL_ITEM_SELECTOR } from '#/server/selectors/food';
import { sumNutrients } from '#/shared/models/food';

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

export const DAY_INFO_SELECTOR = {
  select: {
    id: true,
    date: true,
    medicaments: MEDICAMENT_INTAKE_SELECTOR,
    cosmeticProducts: COSMETIC_PRODUCT_APPLY_SELECTOR,
    femalePeriodStarted: FEMALE_PERIOD_SELECTOR,
    foodMealItems: FOOD_MEAL_ITEM_SELECTOR,
  },
} satisfies Prisma.DayDefaultArgs;

export function convertDayPartSelector(
  data: Prisma.DayPartGetPayload<typeof DAY_PART_SELECTOR>,
): DayPart {
  return data;
}

export function convertDayInfoSelector(
  data: Prisma.DayGetPayload<typeof DAY_INFO_SELECTOR>,
): DayInfo {
  return {
    date: DateUtils.toDateFormat(data.date),
    cosmeticProductApplications: data.cosmeticProducts.map(
      convertCosmeticProductApplicationSelector,
    ),
    medicamentIntakes: data.medicaments.map(convertMedicamentIntakeSelector),
    femalePeriod: data.femalePeriodStarted
      ? convertFemalePeriodSelector(data.femalePeriodStarted)
      : null,
    food: {
      nutrients: sumNutrients(data.foodMealItems.map(meal => meal.nutrients)),
    },
  };
}
