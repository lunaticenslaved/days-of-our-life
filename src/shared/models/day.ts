import { DateFormat } from '#/shared/models/date';
import { FoodNutrients } from '#/shared/models/food';
import { MedicamentIntake } from '#/shared/models/medicament';
import { CosmeticProductApply } from '@prisma/client';

export interface DayPart {
  id: string;
  name: string;
  order: number;
}

export interface DayInfo {
  date: DateFormat;
  weight?: number;
  nutrients?: FoodNutrients;
  // FIXME add female perion to response
  femalePeriod?: {
    startDate: DateFormat;
  };
  medicamentIntakes?: MedicamentIntake[];
  cosmeticProducts?: CosmeticProductApply;
}
