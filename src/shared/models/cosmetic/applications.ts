import { DateFormat } from '#/shared/models/date';

export type CosmeticApplication = {
  id: string;
  date: DateFormat;
  dayPartId: string;
  source:
    | {
        type: 'product';
        productId: string;
      }
    | {
        type: 'recipe';
        recipeId: string;
      };
};
