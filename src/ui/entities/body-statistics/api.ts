import { BodySchema } from '#shared/api/schemas/body';
import { wrapApiAction } from '#ui/utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateFormat } from '#/shared/models/date';
import { Schema } from '#/shared/api/schemas';

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

// Weight
export function useCreateBodyWeightMutation() {
  // FIXME update statistics
  return useMutation({
    mutationKey: [`Schema.days.createBodyWeight`],
    mutationFn: wrapApiAction(Schema.days.createBodyWeight),
  });
}
