export type ApiRequest<T> =
  | {
      type: 'success';
      data: T;
    }
  | {
      type: 'error';
      message: string;
    };
