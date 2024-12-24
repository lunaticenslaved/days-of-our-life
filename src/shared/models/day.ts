import { DateFormat } from '#/shared/models/date';
import { FoodNutrients } from '#/shared/models/food';
import { MedicamentIntake } from '#/shared/models/medicament';

export interface DayPart {
  id: string;
  name: string;
  order: number;
}

export interface DayInfo {
  date: DateFormat;
  weight?: number;
  nutrients?: FoodNutrients;
  medicamentIntakes?: MedicamentIntake[];
}
