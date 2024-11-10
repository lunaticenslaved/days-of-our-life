import { FoodSchema } from '#shared/api/schemas/food';
import { FoodTrackerDay } from '#shared/models/food';
import { wrapApiAction } from '#ui/api';
import { Handlers } from '#ui/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useAddFoodTrackerMealIngredientMutation(
  handlers: Handlers<unknown> = {},
) {
  return useMutation({
    mutationKey: [`FoodSchema.tracker.addMealIngredient`],
    mutationFn: wrapApiAction(FoodSchema.tracker.addMealIngredient, handlers),
  });
}

export function useGetFoodTrackerDayQuery(
  date: string,
  handlers: Handlers<FoodTrackerDay> = {},
) {
  return useQuery({
    queryKey: ['FoodSchema.tracker.days.get'],
    queryFn: () => wrapApiAction(FoodSchema.tracker.days.get, handlers)({ date }),
  });
}
