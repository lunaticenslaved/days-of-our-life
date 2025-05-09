import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { MutationHandlers } from '#/client/types';
import { wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import {
  CreateCosmeticHomemade_StorageItemRequest,
  CreateCosmeticHomemade_StorageItemResponse,
} from '#/shared/api/types/cosmetic/homemade';
import { DefaultError, useMutation } from '@tanstack/react-query';

const keys = {
  update: (ingredientId: string) => [
    'cosmetic',
    'homemade',
    'ingredient',
    ingredientId,
    'store',
  ],
};

export function useUpdateIngredientStore(
  ingredientId: string,
  handlers: Pick<MutationHandlers, 'onError' | 'onSuccess'> = {},
) {
  const cache = useCosmeticCacheStrict();

  return useMutation<
    CreateCosmeticHomemade_StorageItemResponse,
    DefaultError,
    CreateCosmeticHomemade_StorageItemRequest
  >({
    mutationKey: keys.update(ingredientId),
    mutationFn: wrapApiAction<
      CreateCosmeticHomemade_StorageItemRequest,
      CreateCosmeticHomemade_StorageItemResponse
    >(Schema.cosmetic.updateHomemadeCosmeticIngredientStorage),
    onError: (_error, _request) => {
      handlers.onError?.();
    },
    onSuccess: (_response, request) => {
      const ingredient = cache.ingredients.find(request.ingredientId);

      if (ingredient) {
        cache.ingredients.update({
          ...ingredient,
          storage: {
            ...ingredient.storage,
            grams: request.grams,
          },
        });
      }

      handlers.onSuccess?.();
    },
  });
}
