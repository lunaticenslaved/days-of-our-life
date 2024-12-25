import { DaysSchema } from '#/shared/api/schemas/days';
import {
  CreateDayPartRequest,
  CreateDayPartResponse,
  ListDayPartsResponse,
  UpdateDayPartRequest,
  UpdateDayPartResponse,
} from '#/shared/api/types/days';
import { DayPart } from '#/shared/models/day';
import { Handlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';

export function useCreateDayPartMutation(handlers: Handlers<unknown> = {}) {
  return useMutation<
    CreateDayPartResponse,
    DefaultError,
    CreateDayPartRequest,
    CreateDayPartResponse
  >({
    mutationKey: [`days.parts.create`],
    mutationFn: wrapApiAction<CreateDayPartRequest, CreateDayPartResponse>(
      DaysSchema.parts.create,
      handlers,
    ),
    onMutate: async (variables: CreateDayPartRequest) => {
      await queryClient.cancelQueries({ queryKey: [DAY_PART_LIST_QUERY_KEY] });

      const optimisticResponse: CreateDayPartResponse = {
        id: new Date().toISOString(),
        order: 0,
        ...variables,
      };

      queryClient.setQueryData([DAY_PART_LIST_QUERY_KEY], (old: DayPart[]): DayPart[] => [
        ...old,
        optimisticResponse,
      ]);

      return optimisticResponse;
    },
    onSuccess: (result: CreateDayPartResponse, _, context) => {
      queryClient.setQueryData([DAY_PART_LIST_QUERY_KEY], (old: DayPart[]): DayPart[] =>
        old.map(todo => (todo.id === context.id ? result : todo)),
      );
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([DAY_PART_LIST_QUERY_KEY], (old: DayPart[]): DayPart[] =>
        old.filter(todo => todo.id !== context?.id),
      );
    },
  });
}

export function useUpdateDayPartMutation(handlers: Handlers<unknown> = {}) {
  return useMutation<
    UpdateDayPartResponse,
    DefaultError,
    UpdateDayPartRequest,
    {
      updatedItem: DayPart;
    }
  >({
    mutationKey: [`days.parts.update`],
    mutationFn: wrapApiAction<UpdateDayPartRequest, UpdateDayPartResponse>(
      DaysSchema.parts.update,
      handlers,
    ),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: [DAY_PART_LIST_QUERY_KEY] });

      const updatedItem: DayPart = {
        ...variables,
        order: 0,
      };

      queryClient.setQueryData<ListDayPartsResponse>([DAY_PART_LIST_QUERY_KEY], old =>
        old
          ? old.map(item => (item.id === updatedItem.id ? updatedItem : item))
          : undefined,
      );

      return { updatedItem };
    },
    onSuccess: (result, _, context) => {
      queryClient.setQueryData<ListDayPartsResponse>([DAY_PART_LIST_QUERY_KEY], old =>
        old
          ? old.map(todo => (todo.id === context?.updatedItem.id ? result : todo))
          : old,
      );
    },
    onError: () => {
      // FIXME что делать здесь?
    },
  });
}

export function useDeleteDayPartMutation(handlers: Handlers<unknown> = {}) {
  return useMutation({
    mutationKey: [`days.parts.delete`],
    mutationFn: wrapApiAction(DaysSchema.parts.delete, handlers),
  });
}

export function useGetDayPartQuery(id: string) {
  return useQuery({
    queryKey: ['days.parts.get', id],
    queryFn: () => wrapApiAction(DaysSchema.parts.get)({ id }),
  });
}

export const DAY_PART_LIST_QUERY_KEY = 'days.parts.list';

export function useListDayPartsQuery() {
  return useQuery({
    queryKey: [DAY_PART_LIST_QUERY_KEY],
    queryFn: () => wrapApiAction(DaysSchema.parts.list)({}),
  });
}
