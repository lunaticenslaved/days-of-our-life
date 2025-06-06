import { BodyWeight } from '#/shared/models/body';
import { CosmeticProductApplication } from '#/shared/models/cosmetic';
import { DateFormat } from '#/shared/models/date';
import { DayInfo, DayPart } from '#/shared/models/day';
import { FemalePeriod } from '#/shared/models/female-period';
import { FoodMealItem, FoodNutrients } from '#/shared/models/food';
import { MedicamentIntake } from '#/shared/models/medicament';

export type CreateBodyWeightResponse = BodyWeight;
export interface CreateBodyWeightRequest {
  date: DateFormat;
  weight: number;
}

export interface ListDayPartsRequest {}
export type ListDayPartsResponse = DayPart[];

export type CreateDayPartResponse = DayPart;
export interface CreateDayPartRequest {
  name: string;
}

export type UpdateDayPartResponse = DayPart;
export interface UpdateDayPartRequest {
  id: string;
  name: string;
}

export type GetDayPartResponse = DayPart;
export interface GetDayPartRequest {
  id: string;
}

export type DeleteDayPartResponse = void;
export interface DeleteDayPartRequest {
  id: string;
}

export type UpdateDayPartsResponse = DayPart[];
export interface UpdateDayPartsRequest {
  ids: string[];
}

export type ListDaysResponse = Record<DateFormat, DayInfo>;
export interface ListDaysRequest {
  startDate: DateFormat;
  endDate: DateFormat;
}

export type GetDayResponse = DayInfo;
export interface GetDayRequest {
  date: DateFormat;
}

export type StartFemalePeriodResponse = FemalePeriod;
export interface StartFemalePeriodRequest {
  startDate: DateFormat;
}

export interface DeleteFemalePeriodResponse {}
export interface DeleteFemalePeriodRequest {
  startDate: DateFormat;
}

export type AddMedicamentToDateResponse = MedicamentIntake;
export interface AddMedicamentToDateRequest {
  date: DateFormat;
  medicamentId: string;
  dayPartId: string;
}

export type DeleteMedicamentInDateResponse = void;
export interface DeleteMedicamentInDateRequest {
  date: DateFormat;
  medicamentId: string;
  dayPartId: string;
}

// Cosmetic
export type AddCosmeticProductToDateResponse = CosmeticProductApplication;
export interface AddCosmeticProductToDateRequest {
  date: DateFormat;
  dayPartId: string;
  cosmeticProductId: string;
}

export type RemoveCosmeticProductFromDateResponse = void;
export interface RemoveCosmeticProductFromDateRequest {
  date: DateFormat;
  dayPartId: string;
  cosmeticProductId: string;
}

// Food
export type AddFoodNutrientsForDateResponse = FoodNutrients;
export interface AddFoodNutrientsForDateRequest extends FoodNutrients {}

export type ListFoodMealItemsForDateResponse = FoodMealItem[];
export interface ListFoodMealItemsForDateRequest {
  date: DateFormat;
}

export type AddFoodMealItemToDateResponse = FoodMealItem;
export interface AddFoodMealItemToDateRequest {
  date: DateFormat;
  dayPartId: string;
  quantityConverterId: string;
  quantity: number;
  item:
    | {
        type: 'product';
        productId: string;
      }
    | {
        type: 'recipe';
        recipeId: string;
      };
}

export type UpdateFoodMealItemForDateResponse = FoodMealItem;
export interface UpdateFoodMealItemForDateRequest extends AddFoodMealItemToDateRequest {
  mealItemId: string;
}

export interface RemoveFoodMealItemFromDateResponse {}
export interface RemoveFoodMealItemFromDateRequest {
  date: DateFormat;
  mealItemId: string;
  dayPartId: string;
}

export type ReorderCosmeticApplicationsResponse = void;
export type ReorderCosmeticApplicationsRequest = {
  dayPartId: string;
  date: DateFormat;
  applications: Array<{ id: string }>;
};
