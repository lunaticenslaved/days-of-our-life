import { CosmeticProductApplication } from '#/shared/models/cosmetic';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { FoodNutrients } from '#/shared/models/food';
import { MedicamentIntake } from '#/shared/models/medicament';
import { cloneDeep, keyBy, orderBy } from 'lodash';

export interface DayPart {
  id: string;
  name: string;
  order: number;
}

export interface DayInfo {
  date: DateFormat;
  weight?: number;
  femalePeriod: {
    startDate: DateFormat;
  } | null;
  food: {
    nutrients: FoodNutrients;
  };
  medicamentIntakes: MedicamentIntake[];
  cosmeticProductApplications: CosmeticProductApplication[];
}

export const DayUtils = {
  orderByDate: (dayInfos: DayInfo[], order: 'asc' | 'desc' = 'asc') => {
    return orderBy(
      dayInfos,
      info => {
        return DateUtils.fromDateFormat(info.date).getTime();
      },
      order,
    );
  },
  orderFemalePeriods: (dayInfos: Record<DateFormat, DayInfo>) => {
    const dates = Object.keys(dayInfos) as DateFormat[];

    const oldMap = keyBy(dayInfos, (info: DayInfo) => info.date);

    const minDate = DateUtils.min(...dates);
    const maxDate = DateUtils.max(...dates);

    let prevFemalePeriod = oldMap[minDate].femalePeriod;

    return DateUtils.toMap(
      {
        start: minDate,
        end: maxDate,
      },
      date => {
        const dayInfo = cloneDeep(oldMap[date]);

        if (!dayInfo.femalePeriod) {
          dayInfo.femalePeriod = prevFemalePeriod;
        } else if (dayInfo.femalePeriod.startDate === date) {
          prevFemalePeriod = dayInfo.femalePeriod;
        } else {
          dayInfo.femalePeriod = prevFemalePeriod;
        }

        return dayInfo;
      },
    );
  },
};
