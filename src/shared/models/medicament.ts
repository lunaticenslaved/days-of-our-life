import { SortOrder } from '#/shared/models/common';
import { DateFormat } from '#/shared/models/date';
import { DayPart } from '#/shared/models/day';
import { orderBy } from 'lodash';

export interface Medicament {
  id: string;
  name: string;
  isDeleted: boolean;
}

export interface MedicamentIntake {
  id: string;
  date: DateFormat;
  dayPartId: string;
  medicamentId: string;
}

export const MedicamentUtils = {
  sortMedicaments(medicaments: Medicament[], order: SortOrder = 'asc') {
    return orderBy(medicaments, medicaments => medicaments.name, order);
  },
  sortIntakesByDayPart({
    intakes,
    dayParts,
  }: {
    intakes: MedicamentIntake[];
    dayParts: DayPart[];
  }) {
    return orderBy(
      intakes,
      intake => {
        const dayPart = dayParts.find(d => d.id === intake.id);
        return dayPart?.order || 0;
      },
      'asc',
    );
  },
  zipIntakesByDate(intakes: MedicamentIntake[]) {
    const result: Record<DateFormat, MedicamentIntake[]> = {};

    for (const intake of intakes) {
      if (!result[intake.date]) {
        result[intake.date] = [];
      }

      result[intake.date].push(intake);
    }

    return result;
  },
  zipIntakesByDayPart(intakes: MedicamentIntake[]) {
    const result: Record<string, MedicamentIntake[]> = {};

    for (const intake of intakes) {
      if (!result[intake.dayPartId]) {
        result[intake.dayPartId] = [];
      }

      result[intake.dayPartId].push(intake);
    }

    return result;
  },
  zipIntakesByDateAndDatePart(intakes: MedicamentIntake[]) {
    const intakesByDate = MedicamentUtils.zipIntakesByDate(intakes);

    return Object.entries(intakesByDate).reduce(
      (acc, [date, intakes]) => {
        return {
          ...acc,
          [date]: MedicamentUtils.zipIntakesByDayPart(intakes),
        };
      },
      {} as Record<DateFormat, Record<string, MedicamentIntake[]>>,
    );
  },
};
