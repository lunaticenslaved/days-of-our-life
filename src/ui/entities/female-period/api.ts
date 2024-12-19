import { wrapApiAction } from '#ui/utils/api';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FemalePeriodSchema } from '#shared/api/schemas/female-period';
import { DateFormat } from '#/shared/models/date';

export function useDeleteFemalePeriodMutation(handlers: Handlers<unknown> = {}) {
  return useMutation({
    mutationKey: [`FemalePeriodSchema.delete`],
    mutationFn: wrapApiAction(FemalePeriodSchema.delete, handlers),
  });
}

export function useStartFemalePeriodMutation(handlers: Handlers<unknown> = {}) {
  return useMutation({
    mutationKey: [`FemalePeriodSchema.create`],
    mutationFn: wrapApiAction(FemalePeriodSchema.create, handlers),
  });
}

export function useListFemalePeriodsQuery(arg: {
  startDate: DateFormat;
  endDate: DateFormat;
}) {
  return useQuery({
    queryKey: ['FemalePeriodSchema.list'],
    queryFn: () => wrapApiAction(FemalePeriodSchema.list)(arg),
  });
}
