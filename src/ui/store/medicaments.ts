import { Schema } from '#/shared/api/schemas';
import {
  CreateMedicamentRequest,
  CreateMedicamentResponse,
  DeleteMedicamentRequest,
  DeleteMedicamentResponse,
  ListMedicamentsResponse,
  UpdateMedicamentRequest,
  UpdateMedicamentResponse,
} from '#/shared/api/types/medicaments';
import { Medicament, MedicamentUtils } from '#/shared/models/medicament';
import { MutationHandlers } from '#/ui/types';
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
      Schema.medicaments.create,
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
      Schema.medicaments.delete,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: ['Schema.medicaments.list'] });

      const previousItems = queryClient.getQueryData<ListMedicamentsResponse>([
        'Schema.medicaments.list',
      ]);
      const deletedItem = previousItems?.find(item => item.id === request.id);

      queryClient.setQueryData<ListMedicamentsResponse>(
        ['Schema.medicaments.list'],
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
        ['Schema.medicaments.list'],
        old => (old ? (context?.deletedItem ? [...old, context.deletedItem] : old) : old),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Schema.medicaments.list'] });
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
    mutationKey: [`Schema.medicaments.update`],
    mutationFn: wrapApiAction<UpdateMedicamentRequest, UpdateMedicamentResponse>(
      Schema.medicaments.update,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: ['Schema.medicaments.list'] });

      const previousItems = queryClient.getQueryData<ListMedicamentsResponse>([
        'Schema.medicaments.list',
      ]);
      const previousItem = previousItems?.find(item => item.id === request.id);

      if (!previousItem) {
        throw new Error('Medicament item to update not found in cache');
      }

      queryClient.setQueryData<ListMedicamentsResponse>(
        ['Schema.medicaments.list'],
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
        ['Schema.medicaments.list'],
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
      queryClient.invalidateQueries({ queryKey: ['Schema.medicaments.list'] });
    },
  });
}

export function useListMedicamentsQuery() {
  return useQuery<ListMedicamentsResponse>({
    queryKey: ['Schema.medicaments.list'],
    queryFn: wrapApiAction(Schema.medicaments.list),
    select: data => {
      return MedicamentUtils.sortMedicaments(data);
    },
  });
}
