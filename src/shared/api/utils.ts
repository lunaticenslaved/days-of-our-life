type ApiSchemaActionConfig<T> = {
  path(data: T): string;
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE';
  body?: (data: T) => unknown;
  query?: (data: T) => Record<string, unknown>;
};

export function createAction<T, R>(config: ApiSchemaActionConfig<T>) {
  return {
    ...config,
    transformResponse: (data: unknown) => data as R,
  };
}

export type ApiAction<T, R> = ReturnType<typeof createAction<T, R>>;
