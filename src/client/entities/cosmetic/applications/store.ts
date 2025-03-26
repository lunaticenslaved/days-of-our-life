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
  return useQuery<
    ListCosmeticApplicationsResponse,
    Error,
    ListCosmeticApplicationsResponse
  >({
    queryKey: StoreKeys.listCosmeticApplications(),
    queryFn: () =>
      wrapApiAction(Schema.cosmetic.listCosmeticApplications)({ startDate, endDate }),
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
