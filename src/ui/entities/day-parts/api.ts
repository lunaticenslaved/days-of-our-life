import { DaysSchema } from '#/shared/api/schemas/days';
import {
  CreateDayPartRequest,
  CreateDayPartResponse,
  UpdateDayPartRequest,
  UpdateDayPartResponse,
} from '#/shared/api/types/days';
import { DayPart } from '#/shared/models/day';
import { Handlers } from '#/ui/types';
import { queryClient, wrapApiAction } from '#/ui/utils/api';
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
      await queryClient.cancelQueries({ queryKey: ['days.parts.list'] });

      const optimisticResponse: CreateDayPartResponse = {
        id: new Date().toISOString(),
        ...variables,
      };

      queryClient.setQueryData(['days.parts.list'], (old: DayPart[]): DayPart[] => [
        ...old,
        optimisticResponse,
      ]);

      return optimisticResponse;
    },
    onSuccess: (result: CreateDayPartResponse, _, context) => {
      queryClient.setQueryData(['days.parts.list'], (old: DayPart[]): DayPart[] =>
        old.map(todo => (todo.id === context.id ? result : todo)),
      );
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['days.parts.list'], (old: DayPart[]): DayPart[] =>
        old.filter(todo => todo.id !== context?.id),
      );
    },
  });
}

export function useUpdateDayPartMutation(handlers: Handlers<unknown> = {}) {
  return useMutation<
    UpdateDayPartRequest,
    DefaultError,
    UpdateDayPartResponse,
    UpdateDayPartResponse
  >({
    mutationKey: [`days.parts.update`],
    mutationFn: wrapApiAction<UpdateDayPartRequest, UpdateDayPartResponse>(
      DaysSchema.parts.update,
      handlers,
    ),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: ['days.parts.list'] });

      const optimisticResponse: UpdateDayPartResponse = {
        ...variables,
      };

      queryClient.setQueryData(['days.parts.list'], (old: DayPart[]): DayPart[] =>
        old.map(item => (item.id === variables.id ? variables : item)),
      );

      return optimisticResponse;
    },
    onSuccess: (result: UpdateDayPartResponse, _, context) => {
      queryClient.setQueryData(['days.parts.list'], (old: DayPart[]): DayPart[] =>
        old.map(todo => (todo.id === context.id ? result : todo)),
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

export function useListDayPartsQuery() {
  return useQuery({
    queryKey: ['days.parts.list'],
    queryFn: () => wrapApiAction(DaysSchema.parts.list)({}),
  });
}
