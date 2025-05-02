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
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { DateFormat } from '#/shared/models/date';
import {
  ReorderCosmeticApplicationsRequest,
  ReorderCosmeticApplicationsResponse,
} from '#/shared/api/types/days';
import _ from 'lodash';
import { ItemStore } from '#/client/hooks/cache';

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
  const cache = useCosmeticCacheStrict();

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
        order: Number.MAX_SAFE_INTEGER,
        ...request,
      };

      setListCosmeticApplicationsQueryData(cache.applications, {
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
        setListCosmeticApplicationsQueryData(cache.applications, {
          removeCosmeticApplicationById: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      setListCosmeticApplicationsQueryData(cache.applications, {
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
  const cache = useCosmeticCacheStrict();

  return useMutation<
    UpdateCosmeticApplicationResponse,
    DefaultError,
    {
      application: CosmeticApplication;
      newData: Omit<UpdateCosmeticApplicationRequest, 'id'> & { order: number };
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

      setListCosmeticApplicationsQueryData(cache.applications, {
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
        setListCosmeticApplicationsQueryData(cache.applications, {
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
  const cache = useCosmeticCacheStrict();

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

      setListCosmeticApplicationsQueryData(cache.applications, {
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
        setListCosmeticApplicationsQueryData(cache.applications, {
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

  return useQuery<
    ListCosmeticApplicationsResponse,
    Error,
    ListCosmeticApplicationsResponse
  >({
    queryKey: StoreKeys.listCosmeticApplications(),
    queryFn: async () => {
      const response = await wrapApiAction(Schema.cosmetic.listCosmeticApplications)({
        startDate,
        endDate,
      });

      response.forEach(cache.applications.add);

      return response;
    },
    select: data => {
      const result: ListCosmeticApplicationsResponse = [];

      for (const { id } of data) {
        const item = cache.applications.find(id);

        if (item) {
          result.push(item);
        }
      }

      return _.orderBy(result, item => item.order, 'asc');
    },
  });
}

export function useReorderCometicApplications(props: {
  date: DateFormat;
  dayPartId: string;
}) {
  const cache = useCosmeticCacheStrict();

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
    onSuccess: (_response, request) => {
      queryClient.setQueryData<ListCosmeticApplicationsResponse>(
        StoreKeys.listCosmeticApplications(),
        oldData => {
          if (!oldData) {
            return undefined;
          }

          const newItems = oldData.map(item => {
            const index = request.applications.findIndex(appl => appl.id === item.id);

            if (index === -1) {
              return item;
            }

            return {
              ...item,
              order: index,
            };
          });

          newItems.forEach(cache.applications.add);

          return newItems;
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKeys.listCosmeticApplications() });
    },
  });
}

function setListCosmeticApplicationsQueryData(
  store: ItemStore<CosmeticApplication>,
  arg: {
    addCosmeticApplication?: CosmeticApplication;
    removeCosmeticApplicationById?: string;
  },
) {
  if (arg.removeCosmeticApplicationById) {
    store.remove(arg.removeCosmeticApplicationById);

    queryClient.removeQueries({
      queryKey: StoreKeys.getCosmeticApplication(arg.removeCosmeticApplicationById),
    });
  }

  if (arg.addCosmeticApplication) {
    store.add(arg.addCosmeticApplication);

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
