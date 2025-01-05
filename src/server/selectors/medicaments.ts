import { DateUtils } from '#/shared/models/date';
import { Medicament, MedicamentIntake } from '#/shared/models/medicament';
import { Prisma } from '@prisma/client';

export const MEDICAMENT_SELECTOR = {
  select: {
    id: true,
    name: true,
    isDeleted: true,
  },
} satisfies Prisma.MedicamentDefaultArgs;

export const MEDICAMENT_INTAKE_SELECTOR = {
  select: {
    id: true,
    day: {
      select: {
        date: true,
      },
    },
    dayPartId: true,
    medicamentId: true,
  },
} satisfies Prisma.MedicamentIntakeDefaultArgs;

export function convertMedicamentSelector(
  item: Prisma.MedicamentGetPayload<typeof MEDICAMENT_SELECTOR>,
): Medicament {
  return item;
}

export function convertMedicamentIntakeSelector(
  item: Prisma.MedicamentIntakeGetPayload<typeof MEDICAMENT_INTAKE_SELECTOR>,
): MedicamentIntake {
  return {
    ...item,
    date: DateUtils.toDateFormat(item.day.date),
  };
}
