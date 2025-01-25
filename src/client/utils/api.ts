import { QueryClient } from '@tanstack/react-query';

import { ApiResponse } from '#/shared/api/types/shared';
import { ApiAction } from '#/shared/api/utils';
import { Handlers } from '#/client/types';
import axiosLib from 'axios';

const axios = axiosLib.create();
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
    },
  },
});

export function wrapApiAction<
  T extends object,
  R,
  P extends Partial<T> | undefined = undefined,
>(config: ApiAction<T, R>, handlers: Handlers<R> = {}, passArg: P = undefined as P) {
  const fn = async (arg: T) => {
    let path = config.path(arg);
    const body = config.body?.(arg);

    if (config.query) {
      const query = config.query(arg);
      const searchParams = new URLSearchParams();

      if (typeof query === 'object' && query) {
        for (const [key, value] of Object.entries(query)) {
          searchParams.set(key, String(value));
        }
      } else {
        throw new Error('Query is not an object');
      }

      path = `${path}?${searchParams.toString()}`;
    }

    const response = await axios(path, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: body ? JSON.stringify(body) : undefined,
    }).then(res => res.data as ApiResponse<R>);

    return response;
  };

  return async (
    arg: P extends undefined ? T : Omit<T, keyof P>,
    localHandlers: Handlers<R> = {},
  ): Promise<R> => {
    // FIXME remove
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('resolving');
        resolve(undefined);
      }, 1000);
    });

    const response = await fn({ ...(passArg || {}), ...arg } as unknown as T);

    if (response.type === 'error') {
      const error = new Error(response.message);

      handlers.onError?.(error);
      localHandlers.onError?.(error);

      throw error;
    } else {
      handlers?.onSuccess?.(response.data);
      localHandlers?.onSuccess?.(response.data);

      return response.data;
    }
  };
}
