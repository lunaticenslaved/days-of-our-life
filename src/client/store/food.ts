import {
  CreateFoodMealItemRequest,
  CreateFoodMealItemResponse,
  DeleteFoodMealItemResponse,
  ListFoodMealItemsResponse,
  UpdateFoodMealItemRequest,
  UpdateFoodMealItemResponse,
} from '#/shared/api/types/food';
import { MutationHandlers } from '#/client/types';
import { queryClient, wrapApiAction } from '#/client/utils/api';
import { Schema } from '#/shared/api/schemas';
import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { FoodMealItem, FoodNutrients } from '#/shared/models/food';
import { omit } from 'lodash';
import { DateFormat } from '#/shared/models/date';

const StoreKeys = {
  // Meal Item
  listMealItems: (date: DateFormat): QueryKey => ['food', 'meal-items', date, 'list'],
  getMealItem: (mealItemId: string): QueryKey => ['food', 'meal-items', mealItemId],
  createMealItem: (): QueryKey => ['food', 'meal-items', 'create'],
  updateMealItem: (): QueryKey => ['food', 'meal-items', 'update'],
  deleteMealItem: (): QueryKey => ['food', 'meal-items', 'delete'],
};

//
//
//
// Food Meal Item
// FIXME add cache update
export function useListFoodMealItemQuery(date: DateFormat) {
  return useQuery({
    queryKey: StoreKeys.listMealItems(date),
    queryFn: () => wrapApiAction(Schema.food.listFoodMealItems)({ date }),
  });
}

export function useCreateFoodMealItem(handlers: MutationHandlers<FoodMealItem> = {}) {
  return useMutation<
    CreateFoodMealItemResponse,
    Error,
    CreateFoodMealItemRequest & { nutrients: FoodNutrients },
    {
      createdItem: FoodMealItem;
    }
  >({
    mutationKey: StoreKeys.createMealItem(),
    mutationFn: wrapApiAction(Schema.food.createFoodMealItem),
    onMutate(request) {
      const createdItem: FoodMealItem = {
        id: Date.now().toString(),
        date: request.date,
        dayPartId: request.dayPartId,
        quantity: request.quantity,
        nutrients: request.nutrients,
        food: request.food,
      };

      handlers.onMutate?.();

      updateFoodMealItemsQueries({ addFoodMealItem: createdItem });

      return { createdItem };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: context?.createdItem,
      });
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateFoodMealItemsQueries({
        removeFoodMealItem: context.createdItem,
        addFoodMealItem: response,
      });
    },
  });
}

export function useUpdateFoodMealItem(handlers: MutationHandlers<FoodMealItem> = {}) {
  return useMutation<
    UpdateFoodMealItemResponse,
    Error,
    {
      oldItem: FoodMealItem;
      newValues: Omit<UpdateFoodMealItemRequest, 'id'> & { nutrients: FoodNutrients };
    },
    {
      oldItem: FoodMealItem;
      newItem: FoodMealItem;
    }
  >({
    mutationKey: StoreKeys.updateMealItem(),
    mutationFn: data =>
      wrapApiAction(Schema.food.updateFoodMealItem)({
        id: data.oldItem.id,
        ...omit(data.newValues, 'nutrients'),
      }),
    onMutate(request) {
      const newItem: FoodMealItem = {
        ...request.oldItem,
        id: Date.now().toString(),
      };

      handlers.onMutate?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: request.oldItem,
        addFoodMealItem: newItem,
      });

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: context?.newItem,
        addFoodMealItem: context?.oldItem,
      });
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.(response);

      updateFoodMealItemsQueries({
        removeFoodMealItem: context?.newItem,
        addFoodMealItem: response,
      });
    },
  });
}

export function useDeleteFoodMealItem(handlers: MutationHandlers<void> = {}) {
  return useMutation<
    DeleteFoodMealItemResponse,
    Error,
    FoodMealItem & { nutrients: FoodNutrients },
    {
      removedItem: FoodMealItem & { nutrients: FoodNutrients };
    }
  >({
    mutationKey: StoreKeys.deleteMealItem(),
    mutationFn: data => wrapApiAction(Schema.food.deleteFoodMealItem)({ id: data.id }),
    onMutate(request) {
      handlers.onMutate?.();

      updateFoodMealItemsQueries({
        removeFoodMealItem: request,
      });

      return {
        removedItem: request,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      updateFoodMealItemsQueries({
        addFoodMealItem: context?.removedItem,
      });
    },
    onSuccess: (response, _request, _context) => {
      handlers.onSuccess?.(response);
    },
  });
}

function updateFoodMealItemsQueries(arg: {
  addFoodMealItem?: FoodMealItem;
  removeFoodMealItem?: Pick<FoodMealItem, 'id' | 'date'>;
}) {
  if (arg.removeFoodMealItem) {
    queryClient.removeQueries({
      queryKey: StoreKeys.getMealItem(arg.removeFoodMealItem.id),
    });

    queryClient.setQueryData<ListFoodMealItemsResponse>(
      StoreKeys.listMealItems(arg.removeFoodMealItem.date),
      _old => {
        if (!_old) {
          return _old;
        }

        let old = [..._old];

        old = old.filter(item => item.id !== arg.removeFoodMealItem?.id);

        return old;
      },
    );
  }

  if (arg.addFoodMealItem) {
    queryClient.setQueryData(
      StoreKeys.getMealItem(arg.addFoodMealItem.id),
      arg.addFoodMealItem,
    );

    queryClient.setQueryData<ListFoodMealItemsResponse>(
      StoreKeys.listMealItems(arg.addFoodMealItem.date),
      _old => {
        if (!_old) {
          return _old;
        }

        const old = [..._old];

        if (arg.addFoodMealItem) {
          old.push(arg.addFoodMealItem);
        }

        return old;
      },
    );
  }
}
