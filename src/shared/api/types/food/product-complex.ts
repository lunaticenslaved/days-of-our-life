import { Domain } from '#/shared';
import { Action } from '#/shared/api/types';
import { ActionError, ActionRequest, ActionResponse } from '#/shared/api/types/shared';

// CREATE
export type CreateRequest = ActionRequest<
  Action.Food_ProductComplex_Create,
  {
    products: Array<{
      grams: number;
      productId: string;
    }>;
    output: {
      grams: number;
    };
    title: string;
    description?: string;
    recipeId?: string;
  }
>;
export type CreateResponse = ActionResponse<{
  type: 'success';
  data: Domain.Food.ProductComplex;
}>;
export type CreateError = ActionError<{
  type: 'validation_error';
}>;

// VALIDATE
export type ValidateRequest = ActionRequest<
  Action.Food_ProductComplex_Validate,
  CreateRequest['data']
>;
export type ValidateResponse = ActionResponse<
  | {
      type: 'valid';
    }
  | {
      type: 'invalid';
      errors: {
        title?: string;
        description?: string;
        recipeId?: string;
        products?: Array<
          | {
              grams?: string;
              productId?: string;
            }
          | undefined
        >;
        output?: {
          grams?: string;
        };
      };
    }
>;
export type ValidateError = ActionError<void>;
