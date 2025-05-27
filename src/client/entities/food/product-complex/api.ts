import { act } from '#/client/utils/api';
import { Food } from '#/shared/api/types';
import { useMutation } from '@tanstack/react-query';

const keys = {
  create: () => ['food', 'products-complex', 'create'],
};

export function useCreateComplexProductRequest() {
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: act<
      Food.ProductComplex.CreateRequest,
      Food.ProductComplex.CreateResponse
    >,
  });
}
