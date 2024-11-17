import { FoodSchema } from '#shared/api/schemas/food';
import { DateFormat } from '#shared/models/common';
import { FoodTrackerDay } from '#shared/models/food';
import { wrapApiAction } from '#ui/utils/api';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useCreateFoodTrackerMealItemMutation(handlers: Handlers<unknown> = {}) {
  return useMutation({
    mutationKey: [`FoodSchema.tracker.days.meals.items.create`],
    mutationFn: wrapApiAction(FoodSchema.tracker.days.meals.items.create, handlers),
  });
}

export function useUpdateFoodTrackerMealItemMutation(
  itemId: string,
  handlers: Handlers<unknown> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.tracker.meals.days.items.update`],
    mutationFn: wrapApiAction(FoodSchema.tracker.days.meals.items.update, handlers, {
      itemId,
    }),
  });
}

export function useDeleteFoodTrackerMealItemMutation(
  itemId: string,
  handlers: Handlers<unknown> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.tracker.days.meals.items.delete`],
    mutationFn: wrapApiAction(FoodSchema.tracker.days.meals.items.delete, handlers, {
      itemId,
    }),
  });
}

export function useGetFoodTrackerDayQuery(
  date: DateFormat,
  handlers: Handlers<FoodTrackerDay> = {},
) {
  return useQuery({
    queryKey: ['FoodSchema.tracker.days.get', date],
    queryFn: () => wrapApiAction(FoodSchema.tracker.days.get, handlers)({ date }),
  });
}
