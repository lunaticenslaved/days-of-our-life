import { ItemStore } from '#/client/hooks/cache';
import { Schema } from '#/shared/api/schemas';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import {
  DefaultError,
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  CreateCosmeticBenefitRequest,
  CreateCosmeticBenefitResponse,
  DeleteCosmeticBenefitRequest,
  DeleteCosmeticBenefitResponse,
  GetCosmeticBenefitResponse,
  ListCosmeticBenefitsResponse,
  UpdateCosmeticBenefitRequest,
  UpdateCosmeticBenefitResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

const StoreKeys = {
  list: (): QueryKey => ['cosmetic', 'benefits', 'list'],
  create: (): MutationKey => ['cosmetic', 'benefits', 'create'],
  get: (benefitId: string): QueryKey => ['cosmetic', 'benefits', benefitId, 'get'],
  delete: (benefitId: string): MutationKey => [
    'cosmetic',
    'benefits',
    benefitId,
    'delete',
  ],
  update: (benefitId: string): MutationKey => [
    'cosmetic',
    'benefits',
    benefitId,
    'update',
  ],
};

export function useCreateCosmeticBenefitMutation(
  handlers: Pick<MutationHandlers<CosmeticBenefit>, 'onError' | 'onSuccess'> = {},
) {
  const cache = useCosmeticCacheStrict();

  return useMutation<
    CreateCosmeticBenefitResponse,
    DefaultError,
    CreateCosmeticBenefitRequest
  >({
    mutationKey: StoreKeys.create(),
    mutationFn: wrapApiAction<
      CreateCosmeticBenefitRequest,
      CreateCosmeticBenefitResponse
    >(Schema.cosmetic.createCosmeticBenefit),
    onError: (_error, _request) => {
      handlers.onError?.();
    },
    onSuccess: (response, _request) => {
      handlers.onSuccess?.(response);

      updateCosmeticBenefitsQueries(cache.benefits, {
        addCosmeticBenefit: response,
      });

      return response;
    },
  });
}

export function useDeleteCosmeticBenefitMutation(
  benefitId: string,
  handlers: MutationHandlers = {},
) {
  const cache = useCosmeticCacheStrict();

  return useMutation<
    DeleteCosmeticBenefitResponse,
    DefaultError,
    CosmeticBenefit,
    {
      deletedItem?: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.delete(benefitId),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticBenefitRequest, DeleteCosmeticBenefitResponse>(
        Schema.cosmetic.deleteCosmeticBenefit,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.list() });

      const deletedItem = request;

      updateCosmeticBenefitsQueries(cache.benefits, {
        removeCosmeticBenefitById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries(cache.benefits, {
          addCosmeticBenefit: context.deletedItem,
        });
      }
    },
  });
}

export function useUpdateCosmeticBenefitMutation(
  benefitId: string,
  handlers: MutationHandlers<CosmeticBenefit> = {},
) {
  const cache = useCosmeticCacheStrict();

  return useMutation<
    UpdateCosmeticBenefitResponse,
    DefaultError,
    {
      oldItem: CosmeticBenefit;
      newData: Omit<UpdateCosmeticBenefitRequest, 'id'>;
    },
    {
      oldItem: CosmeticBenefit;
      newItem: CosmeticBenefit;
    }
  >({
    mutationKey: StoreKeys.update(benefitId),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticBenefitRequest, UpdateCosmeticBenefitResponse>(
        Schema.cosmetic.updateCosmeticBenefit,
      )({ id: data.oldItem.id, ...data.newData }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.list() });

      const newItem: CosmeticBenefit = {
        id: request.oldItem.id,
        ...request.newData,
      };

      updateCosmeticBenefitsQueries(cache.benefits, {
        removeCosmeticBenefitById: request.oldItem.id,
        addCosmeticBenefit: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        updateCosmeticBenefitsQueries(cache.benefits, {
          removeCosmeticBenefitById: context.newItem.id,
          addCosmeticBenefit: context.oldItem,
        });
      }
    },
    onSuccess: response => {
      handlers.onSuccess?.(response);

      return response;
    },
  });
}

export function useGetCosmeticBenefitQuery(benefitId: string) {
  const cache = useCosmeticCacheStrict();

  return useQuery<GetCosmeticBenefitResponse, Error, GetCosmeticBenefitResponse>({
    queryKey: StoreKeys.get(benefitId),
    queryFn: async () => {
      const result = await wrapApiAction(Schema.cosmetic.getCosmeticBenefit)({
        id: benefitId,
      });

      cache.benefits.add(result);

      return result;
    },
    select: data => {
      return cache.benefits.get(data.id);
    },
  });
}

export function useListCosmeticBenefitsQuery() {
  const cache = useCosmeticCacheStrict();

  return useQuery<ListCosmeticBenefitsResponse, Error, ListCosmeticBenefitsResponse>({
    queryKey: StoreKeys.list(),
    queryFn: async () => {
      const result = await wrapApiAction(Schema.cosmetic.listCosmeticBenefits)({});

      result.forEach(cache.benefits.add);

      return result;
    },
    select: data => {
      return cache.benefits.list(data.map(item => item.id));
    },
  });
}

function updateCosmeticBenefitsQueries(
  cache: ItemStore<CosmeticBenefit>,
  arg: {
    addCosmeticBenefit?: CosmeticBenefit;
    removeCosmeticBenefitById?: string;
  },
) {
  if (arg.removeCosmeticBenefitById) {
    cache.remove(arg.removeCosmeticBenefitById);

    queryClient.removeQueries({
      queryKey: StoreKeys.get(arg.removeCosmeticBenefitById),
    });
  }

  if (arg.addCosmeticBenefit) {
    cache.add(arg.addCosmeticBenefit);

    queryClient.setQueryData(
      StoreKeys.get(arg.addCosmeticBenefit.id),
      arg.addCosmeticBenefit,
    );
  }

  queryClient.setQueryData<ListCosmeticBenefitsResponse>(StoreKeys.list(), _old => {
    if (!_old) {
      return _old;
    }

    let old = [..._old];

    if (arg.removeCosmeticBenefitById) {
      old = old.filter(item => item.id !== arg.removeCosmeticBenefitById);
    }

    if (arg.addCosmeticBenefit) {
      old.push(arg.addCosmeticBenefit);
    }

    return old;
  });
}
