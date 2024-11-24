import { BodySchema } from '#shared/api/schemas/body';
import { DateFormat } from '#shared/models/common';
import { wrapApiAction } from '#ui/utils/api';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function usePostBodyWeightMutation(handlers: Handlers<unknown> = {}) {
  return useMutation({
    mutationKey: [`BodySchema.statistics.weight.create`],
    mutationFn: wrapApiAction(BodySchema.statistics.weight.create, handlers),
  });
}

export function useGetBodyStatisticsQuery(date: DateFormat) {
  return useQuery({
    queryKey: ['BodySchema.statistics.get', date],
    queryFn: () => wrapApiAction(BodySchema.statistics.get)({ date }),
  });
}

export function useListBodyStatisticsQuery(arg: {
  startDate: DateFormat;
  endDate: DateFormat;
}) {
  return useQuery({
    queryKey: ['BodySchema.statistics.list', JSON.stringify(arg)],
    queryFn: () => wrapApiAction(BodySchema.statistics.list)(arg),
  });
}
