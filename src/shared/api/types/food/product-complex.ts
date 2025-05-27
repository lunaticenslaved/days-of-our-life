import { Action } from '#/shared/api/types';
import { ActionRequest, ActionResponse } from '#/shared/api/types/shared';

export type CreateResponse = ActionResponse<{
  id: string;
}>;
export type CreateRequest = ActionRequest<
  Action,
  {
    products: Array<{
      grams: number;
      productId: string;
    }>;
    output: {
      grams: number;
    };
    title: string;
    recipeId?: string;
  }
>;
