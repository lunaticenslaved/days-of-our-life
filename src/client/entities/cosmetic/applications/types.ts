import { DateFormat } from '#/shared/models/date';

export type LocalApplication = {
  id: string;
  date: DateFormat;
  dayPartId: string;
  source:
    | {
        type: 'product';
        productId: string;
        product: {
          id: string;
          name: string;
        };
      }
    | {
        type: 'recipe';
        recipeId: string;
        recipe: {
          id: string;
          name: string;
        };
      };
};
