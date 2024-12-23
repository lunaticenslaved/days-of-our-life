import { DateFormat } from '#/shared/models/date';
import { FoodNutrients } from '#shared/models/food';

export interface StatisticItem {
  date: DateFormat;
  body: {
    weight?: number;
  };
  food: {
    nutrients?: FoodNutrients;
  };
  period?: {
    startDate: DateFormat;
    endDate?: DateFormat;
  };
}
