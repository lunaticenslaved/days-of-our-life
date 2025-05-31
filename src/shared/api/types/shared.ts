import { Action } from '#/shared/api/types';

export type PaginatedRequest = {
  page?: number;
  pageSize?: number;
};

export type PaginatedResponse<T> = {
  total: number;
  results: T[];
};

export type ApiResponse<T> =
  | {
      type: 'success';
      data: T;
    }
  | {
      type: 'error';
      message: string;
    };

export type ActionResponse<TData> = TData & {
  //
};

export type ActionRequest<TAction extends Action, TData> = {
  action: TAction;
  data: TData;
};

export type ActionError<TData> = TData & ActionCommonError;

export type ActionCommonError =
  | {
      type: 'error/common/validation-error';
    }
  | {
      type: 'error/common/unknown-action';
    };
