import {
  CreateCosmeticApplicationRequest,
  CreateCosmeticApplicationResponse,
  DeleteCosmeticApplicationRequest,
  DeleteCosmeticApplicationResponse,
  ListCosmeticApplicationsRequest,
  ListCosmeticApplicationsResponse,
  UpdateCosmeticApplicationRequest,
  UpdateCosmeticApplicationResponse,
} from '#/shared/api/types/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import { MutationHandlers } from '#/client/types';
import { LocalApplication } from '#/client/entities/cosmetic/applications/types';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { nonReachable } from '#/shared/utils';
import { DateFormat } from '#/shared/models/date';
import {
  ReorderCosmeticApplicationsRequest,
  ReorderCosmeticApplicationsResponse,
} from '#/shared/api/types/days';

const StoreKeys = {
  // FIXME use dates in key
  listCosmeticApplications: () => ['cosmetic', 'applications', 'list'],
  createCosmeticApplication: () => ['cosmetic', 'applications', 'create'],
  updateCosmeticApplication: (id: string) => ['cosmetic', 'applications', 'update', id],
  deleteCosmeticApplication: (id: string) => ['cosmetic', 'applications', 'delete', id],
  getCosmeticApplication: (id: string) => ['cosmetic', 'applications', 'get', id],
};

export function useCreateCosmeticApplicationMutation(
  handlers: MutationHandlers<CosmeticApplication> = {},
) {
  return useMutation<
    CreateCosmeticApplicationResponse,
    DefaultError,
    CreateCosmeticApplicationRequest,
    {
      createdItem: CosmeticApplication;
    }
  >({
    mutationKey: StoreKeys.createCosmeticApplication(),
    mutationFn: wrapApiAction<
      CreateCosmeticApplicationRequest,
      CreateCosmeticApplicationResponse
    >(Schema.cosmetic.createCosmeticApplication),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticApplications(),
      });

      const createdItem: CosmeticApplication = {
        id: Date.now().toString(),
        ...request,
      };

      setListCosmeticApplicationsQueryData({
        addCosmeticApplication: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setListCosmeticApplicationsQueryData({
          removeCosmeticApplicationById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      setListCosmeticApplicationsQueryData({
        removeCosmeticApplicationById: context?.createdItem.id,
        addCosmeticApplication: response,
      });

      return response;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.listCosmeticApplications() });
    },
  });
}

export function useUpdateCosmeticApplicationMutation(
  applicationId: string,
  handlers: MutationHandlers<CosmeticApplication> = {},
) {
  return useMutation<
    UpdateCosmeticApplicationResponse,
    DefaultError,
    {
      application: CosmeticApplication;
      newData: Omit<UpdateCosmeticApplicationRequest, 'id'>;
    },
    {
      oldItem: CosmeticApplication;
      newItem: CosmeticApplication;
    }
  >({
    mutationKey: StoreKeys.updateCosmeticApplication(applicationId),
    mutationFn: data =>
      wrapApiAction<UpdateCosmeticApplicationRequest, UpdateCosmeticApplicationResponse>(
        Schema.cosmetic.updateCosmeticApplication,
      )({ ...data.newData, id: data.application.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({
        queryKey: StoreKeys.listCosmeticApplications(),
      });

      const newItem: CosmeticApplication = {
        ...request.newData,
        id: request.application.id,
      };

      setListCosmeticApplicationsQueryData({
        removeCosmeticApplicationById: request.application.id,
        addCosmeticApplication: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.application,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setListCosmeticApplicationsQueryData({
          removeCosmeticApplicationById: context.newItem.id,
          addCosmeticApplication: context.oldItem,
        });
      }
    },
  });
}

export function useDeleteCosmeticApplicationMutation(
  applicationId: string,
  handlers: MutationHandlers = {},
) {
  return useMutation<
    DeleteCosmeticApplicationResponse,
    DefaultError,
    CosmeticApplication,
    {
      deletedItem?: CosmeticApplication;
    }
  >({
    mutationKey: StoreKeys.deleteCosmeticApplication(applicationId),
    mutationFn: data =>
      wrapApiAction<DeleteCosmeticApplicationRequest, DeleteCosmeticApplicationResponse>(
        Schema.cosmetic.deleteCosmeticApplication,
      )({ id: data.id }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listCosmeticApplications() });

      const deletedItem = request;

      setListCosmeticApplicationsQueryData({
        removeCosmeticApplicationById: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setListCosmeticApplicationsQueryData({
          addCosmeticApplication: context.deletedItem,
        });
      }
    },
  });
}

export function useListCosmeticApplicationsQuery({
  startDate,
  endDate,
}: ListCosmeticApplicationsRequest) {
  const cache = useCosmeticCacheStrict();

  return useQuery<ListCosmeticApplicationsResponse, Error, LocalApplication[]>({
    queryKey: StoreKeys.listCosmeticApplications(),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.listCosmeticApplications)({ startDate, endDate }),
    select: data => {
      return data.map((appl): LocalApplication => {
        if (appl.source.type === 'recipe') {
          return {
            id: appl.id,
            date: appl.date,
            dayPartId: appl.dayPartId,
            source: {
              type: 'recipe',
              recipeId: appl.source.recipeId,
              recipe: {
                id: appl.source.recipeId,
                name: cache.recipes.find(appl.source.recipeId)?.name || '-',
              },
            },
          };
        } else if (appl.source.type === 'product') {
          return {
            id: appl.id,
            date: appl.date,
            dayPartId: appl.dayPartId,
            source: {
              type: 'product',
              productId: appl.source.productId,
              product: {
                id: appl.source.productId,
                name: cache.products.find(appl.source.productId)?.name || '-',
              },
            },
          };
        } else {
          nonReachable(appl.source);
        }
      });
    },
  });
}

export function useReorderCometicApplications(props: {
  date: DateFormat;
  dayPartId: string;
}) {
  // FIXME update cache
  return useMutation<
    ReorderCosmeticApplicationsResponse,
    DefaultError,
    ReorderCosmeticApplicationsRequest,
    {
      createdItem: CosmeticApplication;
    }
  >({
    mutationKey: StoreKeys.createCosmeticApplication(),
    mutationFn: (arg: Omit<ReorderCosmeticApplicationsRequest, 'date' | 'dayPartId'>) =>
      wrapApiAction<
        ReorderCosmeticApplicationsRequest,
        ReorderCosmeticApplicationsResponse
      >(Schema.days.reorderCosmeticApplications)({
        ...props,
        ...arg,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.listCosmeticApplications() });
    },
  });
}

function setListCosmeticApplicationsQueryData(arg: {
  addCosmeticApplication?: CosmeticApplication;
  removeCosmeticApplicationById?: string;
}) {
  if (arg.removeCosmeticApplicationById) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticApplication(arg.removeCosmeticApplicationById),
    });
  }

  if (arg.addCosmeticApplication) {
    queryClient.setQueryData(
      StoreKeys.getCosmeticApplication(arg.addCosmeticApplication.id),
      arg.addCosmeticApplication,
    );
  }

  queryClient.setQueryData<ListCosmeticApplicationsResponse>(
    StoreKeys.listCosmeticApplications(),
    _old => {
      if (!_old) {
        return _old;
      }

      let old = [..._old];

      if (arg.removeCosmeticApplicationById) {
        old = old.filter(item => item.id !== arg.removeCosmeticApplicationById);
      }

      if (arg.addCosmeticApplication) {
        old.push(arg.addCosmeticApplication);
      }

      return old;
    },
  );
}
