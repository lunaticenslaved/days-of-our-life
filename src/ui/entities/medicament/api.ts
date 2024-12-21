import { MedicamentsSchema } from '#/shared/api/schemas/medicament';
import {
  CreateMedicamentRequest,
  CreateMedicamentResponse,
  DeleteMedicamentRequest,
  DeleteMedicamentResponse,
  ListMedicamentIntakesResponse,
  ListMedicamentsResponse,
  UpdateMedicamentRequest,
  UpdateMedicamentResponse,
  CreateMedicamentIntakeRequest,
  CreateMedicamentIntakeResponse,
  ListMedicamentIntakesRequest,
  DeleteMedicamentIntakeResponse,
  DeleteMedicamentIntakeRequest,
  UpdateMedicamentIntakeResponse,
  UpdateMedicamentIntakeRequest,
} from '#/shared/api/types/medicaments';
import {
  Medicament,
  MedicamentIntake,
  MedicamentUtils,
} from '#/shared/models/medicament';
import { queryClient, wrapApiAction } from '#/ui/utils/api';
import {
  DefaultError,
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

export const MedicamentQueryKeys = {
  intakes: {
    list: (): QueryKey => ['MedicamentsSchema.intakes.list'],
    create: (): MutationKey => ['MedicamentsSchema.intakes.create'],
    delete: (): MutationKey => ['MedicamentsSchema.intakes.delete'],
    update: (): MutationKey => ['MedicamentsSchema.intakes.update'],
  },
};

interface MutationHandlers {
  onMutate?(): void;
  onError?(): void;
  onSuccess?(): void;
}

// Medicaments
export function useCreateMedicamentMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    CreateMedicamentResponse,
    DefaultError,
    CreateMedicamentRequest,
    {
      createdItem: Medicament;
    }
  >({
    mutationKey: [`MedicamentsSchema.create`],
    mutationFn: wrapApiAction<CreateMedicamentRequest, CreateMedicamentResponse>(
      MedicamentsSchema.medicaments.create,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: ['MedicamentsSchema.list'] });

      const createdItem: Medicament = {
        id: Date.now().toString(),
        name: request.name,
        isDeleted: false,
      };

      queryClient.setQueryData<ListMedicamentsResponse>(
        ['MedicamentsSchema.list'],
        (old = []) => (old ? [...old, createdItem] : old),
      );

      handlers.onMutate?.();

      return {
        createdItem: createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();
      queryClient.setQueryData<ListMedicamentsResponse>(
        ['MedicamentsSchema.list'],
        old => (old ? old.filter(item => item.id !== context?.createdItem.id) : old),
      );
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.();

      queryClient.setQueryData<ListMedicamentsResponse>(
        ['MedicamentsSchema.list'],
        previousItems => {
          return previousItems?.map(item => {
            if (item.id === context.createdItem.id) {
              return response;
            } else {
              return item;
            }
          });
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['MedicamentsSchema.list'] });
    },
  });
}

export function useDeleteMedicamentMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteMedicamentResponse,
    DefaultError,
    DeleteMedicamentRequest,
    {
      deletedItem?: Medicament;
    }
  >({
    mutationKey: [`MedicamentsSchema.delete`],
    mutationFn: wrapApiAction<DeleteMedicamentRequest, DeleteMedicamentResponse>(
      MedicamentsSchema.medicaments.delete,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: ['MedicamentsSchema.list'] });

      const previousItems = queryClient.getQueryData<ListMedicamentsResponse>([
        'MedicamentsSchema.list',
      ]);
      const deletedItem = previousItems?.find(item => item.id === request.id);

      queryClient.setQueryData<ListMedicamentsResponse>(
        ['MedicamentsSchema.list'],
        old => (old ? old.filter(item => item.id !== request.id) : old),
      );

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();
      queryClient.setQueryData<ListMedicamentsResponse>(
        ['MedicamentsSchema.list'],
        old => (old ? (context?.deletedItem ? [...old, context.deletedItem] : old) : old),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['MedicamentsSchema.list'] });
    },
  });
}

export function useUpdateMedicamentMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateMedicamentResponse,
    DefaultError,
    UpdateMedicamentRequest,
    {
      previousItem: Medicament;
    }
  >({
    mutationKey: [`MedicamentsSchema.update`],
    mutationFn: wrapApiAction<UpdateMedicamentRequest, UpdateMedicamentResponse>(
      MedicamentsSchema.medicaments.update,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: ['MedicamentsSchema.list'] });

      const previousItems = queryClient.getQueryData<ListMedicamentsResponse>([
        'MedicamentsSchema.list',
      ]);
      const previousItem = previousItems?.find(item => item.id === request.id);

      if (!previousItem) {
        throw new Error('Medicament item to update not found in cache');
      }

      queryClient.setQueryData<ListMedicamentsResponse>(
        ['MedicamentsSchema.list'],
        old =>
          old?.map(item => {
            if (item.id === request.id) {
              return {
                ...request,
                isDeleted: item.isDeleted,
              };
            } else {
              return item;
            }
          }),
      );

      handlers.onMutate?.();

      return {
        previousItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();
      queryClient.setQueryData<ListMedicamentsResponse>(
        ['MedicamentsSchema.list'],
        old =>
          old?.map(item => {
            if (context && item.id === context.previousItem.id) {
              return context.previousItem;
            } else {
              return item;
            }
          }),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['MedicamentsSchema.list'] });
    },
  });
}

export function useListMedicamentsQuery() {
  return useQuery<ListMedicamentsResponse>({
    queryKey: ['MedicamentsSchema.list'],
    queryFn: wrapApiAction(MedicamentsSchema.medicaments.list),
    select: data => {
      return MedicamentUtils.sortMedicaments(data);
    },
  });
}

// Medicaments Intake
export function useCreateMedicamentIntakeMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    CreateMedicamentIntakeResponse,
    DefaultError,
    CreateMedicamentIntakeRequest,
    { createdItem: MedicamentIntake }
  >({
    mutationKey: MedicamentQueryKeys.intakes.create(),
    mutationFn: wrapApiAction<
      CreateMedicamentIntakeRequest,
      CreateMedicamentIntakeResponse
    >(MedicamentsSchema.intakes.create),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: MedicamentQueryKeys.intakes.list() });

      const createdItem: MedicamentIntake = {
        id: Date.now().toString(),
        date: request.date,
        dayPartId: request.dayPartId,
        medicamentId: request.medicamentId,
      };

      queryClient.setQueryData<ListMedicamentIntakesResponse>(
        MedicamentQueryKeys.intakes.list(),
        (old = []) => (old ? [...old, createdItem] : old),
      );

      handlers.onMutate?.();

      return {
        createdItem: createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();
      queryClient.setQueryData<ListMedicamentIntakesResponse>(
        MedicamentQueryKeys.intakes.list(),
        old => (old ? old.filter(item => item.id !== context?.createdItem.id) : old),
      );
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.();

      queryClient.setQueryData<ListMedicamentIntakesResponse>(
        MedicamentQueryKeys.intakes.list(),
        previousItems => {
          return previousItems?.map(item => {
            if (item.id === context.createdItem.id) {
              return response;
            } else {
              return item;
            }
          });
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MedicamentQueryKeys.intakes.list() });
    },
  });
}

export function useUpdateMedicamentIntakeMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateMedicamentIntakeResponse,
    DefaultError,
    UpdateMedicamentIntakeRequest,
    {
      previousItem: MedicamentIntake;
    }
  >({
    mutationKey: [`MedicamentsSchema.update`],
    mutationFn: wrapApiAction<
      UpdateMedicamentIntakeRequest,
      UpdateMedicamentIntakeResponse
    >(MedicamentsSchema.intakes.update),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: MedicamentQueryKeys.intakes.list() });

      const previousItems = queryClient.getQueryData<ListMedicamentIntakesResponse>(
        MedicamentQueryKeys.intakes.list(),
      );
      const previousItem = previousItems?.find(item => item.id === request.id);

      if (!previousItem) {
        throw new Error('Medicament item to update not found in cache');
      }

      queryClient.setQueryData<ListMedicamentIntakesResponse>(
        MedicamentQueryKeys.intakes.list(),
        old =>
          old?.map(item => {
            if (item.id === request.id) {
              return request;
            } else {
              return item;
            }
          }),
      );

      handlers.onMutate?.();

      return {
        previousItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();
      queryClient.setQueryData<ListMedicamentIntakesResponse>(
        MedicamentQueryKeys.intakes.list(),
        old =>
          old?.map(item => {
            if (context && item.id === context.previousItem.id) {
              return context.previousItem;
            } else {
              return item;
            }
          }),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MedicamentQueryKeys.intakes.list() });
    },
  });
}

export function useDeleteMedicamentIntakeMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteMedicamentIntakeResponse,
    DefaultError,
    DeleteMedicamentIntakeRequest,
    {
      deletedItem?: Medicament;
    }
  >({
    mutationKey: MedicamentQueryKeys.intakes.delete(),
    mutationFn: wrapApiAction<
      DeleteMedicamentIntakeRequest,
      DeleteMedicamentIntakeResponse
    >(MedicamentsSchema.intakes.delete),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: MedicamentQueryKeys.intakes.list() });

      const previousItems = queryClient.getQueryData<ListMedicamentsResponse>(
        MedicamentQueryKeys.intakes.list(),
      );
      const deletedItem = previousItems?.find(item => item.id === request.id);

      queryClient.setQueryData<ListMedicamentsResponse>(
        MedicamentQueryKeys.intakes.list(),
        old => (old ? old.filter(item => item.id !== request.id) : old),
      );

      handlers.onMutate?.();

      return {
        deletedItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();
      queryClient.setQueryData<ListMedicamentsResponse>(
        MedicamentQueryKeys.intakes.list(),
        old => (old ? (context?.deletedItem ? [...old, context.deletedItem] : old) : old),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MedicamentQueryKeys.intakes.list() });
    },
  });
}

export function useListMedicamentIntakesQuery(arg: ListMedicamentIntakesRequest) {
  return useQuery<ListMedicamentIntakesResponse>({
    queryKey: MedicamentQueryKeys.intakes.list(),
    queryFn: () => {
      return wrapApiAction(MedicamentsSchema.intakes.list)(arg);
    },
  });
}
