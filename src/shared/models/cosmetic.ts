import { DateFormat } from '#/shared/models/date';

export interface CosmeticProduct {
  id: string;
  name: string;
  manufacturer: string;
}

export interface CosmeticProductApplication {
  id: string;
  date: DateFormat;
  dayPartId: string;
  cosmeticProductId: string;
}

export interface CosmeticIngredient {
  id: string;
  name: string;
}
