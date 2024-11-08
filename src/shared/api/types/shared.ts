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
