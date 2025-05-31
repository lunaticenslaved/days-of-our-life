import { useFoodCacheStrict } from '#/client/entities/food/cache';
import { MutationHandlers } from '#/client/types';
import { act } from '#/client/utils/api';
import { Food } from '#/shared/api/types';
import { nonReachable } from '#/shared/utils';
import { useMutation } from '@tanstack/react-query';

const keys = {
  create: () => ['food', 'products-complex', 'create'],
  validate: () => ['food', 'products-complex', 'validate'],
};

export function useFoodProductComplexCreateRequest(
  handlers: Pick<MutationHandlers, 'onError' | 'onSuccess'>,
) {
  const cache = useFoodCacheStrict();

  return useMutation<
    Food.ProductComplex.CreateResponse,
    Food.ProductComplex.CreateError,
    Food.ProductComplex.CreateRequest
  >({
    mutationKey: keys.create(),
    mutationFn: act,

    onSuccess: response => {
      if (response.type === 'success') {
        cache.productComplexes.add(response.data);
      } else {
        nonReachable(response.type);
      }

      handlers.onSuccess?.();
    },
    onError: () => {
      // FIXME validation error

      handlers.onError?.();
    },
  });
}

export function useFoodProductComplexValidateRequest(
  handlers: {
    onError?: (error: Food.ProductComplex.ValidateError) => void;
    onSuccess?: (response: Food.ProductComplex.ValidateResponse) => void;
  } = {},
) {
  return useMutation<
    Food.ProductComplex.ValidateResponse,
    Food.ProductComplex.ValidateError,
    Food.ProductComplex.ValidateRequest
  >({
    mutationKey: keys.validate(),
    mutationFn: act,

    onSuccess: response => {
      if (response.type === 'valid') {
        //
      } else if (response.type === 'invalid') {
        //
      } else {
        nonReachable(response);
      }

      handlers.onSuccess?.(response);
    },

    onError: error => {
      // FIXME validation error

      handlers.onError?.(error);
    },
  });
}
