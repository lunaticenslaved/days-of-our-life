import { DateFormat } from '#/shared/models/date';

export interface CosmeticProduct {
  id: string;
  name: string;
  manufacturer: string;
}

export interface CosmeticProductApply {
  id: string;
  date: DateFormat;
  dayPartId: string;
  cosmeticProduct: CosmeticProduct;
}
