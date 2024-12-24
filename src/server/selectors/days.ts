import { DayPart } from '#/shared/models/day';
import { Prisma } from '@prisma/client';

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
