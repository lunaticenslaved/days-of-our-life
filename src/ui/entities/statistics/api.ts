import { StatisticsSchema } from '#shared/api/schemas/statistics';
import {
  GetStatisticsRequest,
  ListStatisticsRequest,
} from '#shared/api/types/statistics';
import { wrapApiAction } from '#ui/utils/api';
import { useQuery } from '@tanstack/react-query';

export function useListStatisticsQuery(arg: ListStatisticsRequest) {
  return useQuery({
    queryKey: ['StatisticsSchema.list', JSON.stringify(arg)],
    queryFn: () => wrapApiAction(StatisticsSchema.list)(arg),
  });
}

export function useGetStatisticsQuery(arg: GetStatisticsRequest) {
  return useQuery({
    queryKey: ['StatisticsSchema.get', JSON.stringify(arg)],
    queryFn: () => wrapApiAction(StatisticsSchema.get)(arg),
  });
}
