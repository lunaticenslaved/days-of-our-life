import { queryClient, wrapApiAction } from '#/client/utils/api';
import {
  DefaultError,
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { Schema } from '#/shared/api/schemas';
import {
  ListDaysRequest,
  ListDaysResponse,
  GetDayResponse,
  StartFemalePeriodResponse,
  StartFemalePeriodRequest,
  DeleteFemalePeriodRequest,
  DeleteFemalePeriodResponse,
  CreateBodyWeightRequest,
  CreateBodyWeightResponse,
  AddMedicamentToDateRequest,
  AddMedicamentToDateResponse,
  DeleteMedicamentInDateRequest,
  DeleteMedicamentInDateResponse,
  AddCosmeticProductToDateResponse,
  AddCosmeticProductToDateRequest,
  RemoveCosmeticProductFromDateResponse,
  RemoveCosmeticProductFromDateRequest,
  AddFoodMealItemToDateResponse,
  AddFoodMealItemToDateRequest,
  UpdateFoodMealItemForDateResponse,
  UpdateFoodMealItemForDateRequest,
  RemoveFoodMealItemFromDateRequest,
  RemoveFoodMealItemFromDateResponse,
  ListFoodMealItemsForDateResponse,
  CreateDayPartRequest,
  CreateDayPartResponse,
  DeleteDayPartResponse,
  ListDayPartsResponse,
  UpdateDayPartRequest,
  UpdateDayPartResponse,
} from '#/shared/api/types/days';

import { DayPart } from '#/shared/models/day';
import { MutationHandlers } from '#/client/types';
import { DateFormat } from '#/shared/models/date';
import { MedicamentIntake } from '#/shared/models/medicament';
import { CosmeticProductApplication } from '#/shared/models/cosmetic';
import { cloneDeep } from 'lodash';
import { FemalePeriod } from '#/shared/models/female-period';
import { FoodMealItem, sumNutrients } from '#/shared/models/food';
import { DayUtils } from '#/shared/models/day';

const StoreKey = {
  getDayQuery: (): QueryKey => ['getDayQuery'],
  listDaysQuery: (): QueryKey => ['listDaysQuery'],
  createBodyWeightMutation: (): QueryKey => ['createBodyWeightMutation'],
  createMedicamentIntakeMutation: (): QueryKey => ['createMedicamentIntakeMutation'],
  deleteMedicamentIntakeMutation: (): QueryKey => ['deleteMedicamentIntakeMutation'],
  startFemalePeriodMutation: (): QueryKey => ['startFemalePeriodMutation'],
  deleteFemalePeriodMutation: (): QueryKey => ['deleteFemalePeriodMutation'],
  addCosmeticProductToDateMutation: (): QueryKey => ['addCosmeticProductToDateMutation'],
  deleteCosmeticProductFromDateMutation: (): QueryKey => [
    'deleteCosmeticProductFromDateMutation',
  ],

  // Food
  addFoodToDate: (): MutationKey => ['addFoodToDate'],
  updateFoodForDate: (): MutationKey => ['updateFoodForDate'],
  deleteFoodFromDate: (): MutationKey => ['deleteFoodFromDate'],
  listFoodForDate: (): QueryKey => ['listFoodForDate'],

  // Day Parts
  listDayParts: (): QueryKey => ['days', 'parts', 'list'],
  getDayPart: (dayPartId: string): QueryKey => ['days', 'parts', dayPartId, 'get'],
  createDayPart: (): MutationKey => ['days', 'parts', 'create'],
  updateDayPart: (): MutationKey => ['days', 'parts', 'update'],
  deleteDayPart: (): MutationKey => ['days', 'parts', 'delete'],
};

// Days
function setDaysQueryData(
  date: DateFormat,
  arg: {
    weight?: number;
    addMedicamentIntake?: MedicamentIntake;
    addCosmeticProductApplication?: CosmeticProductApplication;
    removeCosmeticProductApplicationId?: string;
    removeMedicamentIntakeId?: string;
    addFemalePeriod?: true;
    removeFemalePeriod?: true;
    addFoodMealItem?: FoodMealItem;
    removeFoodMealItemId?: string;
  },
) {
  // FIXME set data for getDay request

  queryClient.setQueryData<ListDaysResponse>(StoreKey.listDaysQuery(), _old => {
    if (!_old) {
      return _old;
    }

    let old = cloneDeep(_old);

    if (!(date in old)) {
      old[date] = {
        date: date,
        cosmeticProductApplications: [],
        medicamentIntakes: [],
        food: {
          nutrients: sumNutrients([]),
        },
        femalePeriod: null,
      };
    }

    if (typeof arg.weight === 'number') {
      old[date].weight = arg.weight;
    }

    if (arg.addCosmeticProductApplication) {
      old[date].cosmeticProductApplications = [
        ...(old[date].cosmeticProductApplications || []),
        arg.addCosmeticProductApplication,
      ];
    }

    if (arg.removeCosmeticProductApplicationId) {
      const oldIntakes = old[date].cosmeticProductApplications;

      if (oldIntakes) {
        old[date].cosmeticProductApplications = oldIntakes.filter(
          intake => intake.id !== arg.removeCosmeticProductApplicationId,
        );
      }
    }

    if (arg.addMedicamentIntake) {
      old[date].medicamentIntakes = [
        ...(old[date].medicamentIntakes || []),
        arg.addMedicamentIntake,
      ];
    }

    if (arg.removeMedicamentIntakeId) {
      const oldIntakes = old[date].medicamentIntakes;

      if (oldIntakes) {
        old[date].medicamentIntakes = oldIntakes.filter(
          intake => intake.id !== arg.removeMedicamentIntakeId,
        );
      }
    }

    if (arg.removeFemalePeriod || arg.addFemalePeriod) {
      if (arg.removeFemalePeriod) {
        old[date].femalePeriod = null;
      }

      if (arg.addFemalePeriod) {
        old[date].femalePeriod = { startDate: date };
      }

      old = DayUtils.orderFemalePeriods(old);
    }

    return old;
  });
}

export function useListDaysQuery(data: ListDaysRequest) {
  return useQuery<ListDaysResponse, DefaultError, ListDaysResponse>({
    queryKey: StoreKey.listDaysQuery(),
    queryFn: () => wrapApiAction(Schema.days.listDays)(data),
  });
}

export function useGetDayQuery(date: DateFormat) {
  return useQuery<GetDayResponse, DefaultError, GetDayResponse>({
    queryKey: StoreKey.getDayQuery(),
    queryFn: () => wrapApiAction(Schema.days.getDay)({ date }),
  });
}

// Weight
export function useCreateBodyWeightMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    CreateBodyWeightResponse,
    Error,
    CreateBodyWeightRequest,
    {
      response: CreateBodyWeightResponse;
      oldWeight?: number;
    }
  >({
    mutationKey: StoreKey.createBodyWeightMutation(),
    mutationFn: wrapApiAction(Schema.days.createBodyWeight),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDaysQuery() });

      const response: CreateBodyWeightResponse = {
        date: request.date,
        weight: request.weight,
      };

      const oldWeight = queryClient.getQueryData<ListDaysResponse>(
        StoreKey.listDaysQuery(),
      )?.[response.date]?.weight;

      setDaysQueryData(response.date, response);

      handlers.onMutate?.();

      return {
        response,
        oldWeight,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.response.date, {
          weight: context.oldWeight,
        });
      }
    },
    onSuccess: (_response, _request, _context) => {
      handlers.onSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKey.listDaysQuery() });
    },
  });
}

// Medicaments
export function useCreateMedicamentIntakeMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    AddMedicamentToDateResponse,
    DefaultError,
    AddMedicamentToDateRequest,
    { createdItem: MedicamentIntake }
  >({
    mutationKey: StoreKey.createMedicamentIntakeMutation(),
    mutationFn: wrapApiAction<AddMedicamentToDateRequest, AddMedicamentToDateResponse>(
      Schema.days.createMedicamentIntake,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDaysQuery() });

      const createdItem: MedicamentIntake = {
        id: Date.now().toString(),
        date: request.date,
        dayPartId: request.dayPartId,
        medicamentId: request.medicamentId,
      };

      setDaysQueryData(request.date, {
        addMedicamentIntake: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem: createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.createdItem.date, {
          removeMedicamentIntakeId: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.();

      setDaysQueryData(context.createdItem.date, {
        removeMedicamentIntakeId: context.createdItem.id,
        addMedicamentIntake: response,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKey.listDaysQuery() });
    },
  });
}

export function useDeleteMedicamentIntakeMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteMedicamentInDateResponse,
    DefaultError,
    MedicamentIntake,
    {
      deletedItem: MedicamentIntake;
    }
  >({
    mutationKey: StoreKey.deleteMedicamentIntakeMutation(),
    mutationFn: data =>
      wrapApiAction<DeleteMedicamentInDateRequest, DeleteMedicamentInDateResponse>(
        Schema.days.deleteMedicamentIntake,
      )({
        date: data.date,
        dayPartId: data.dayPartId,
        medicamentId: data.medicamentId,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDaysQuery() });

      setDaysQueryData(request.date, {
        removeMedicamentIntakeId: request.id,
      });

      handlers.onMutate?.();

      return {
        deletedItem: request,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.deletedItem.date, {
          addMedicamentIntake: context.deletedItem,
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKey.listDaysQuery() });
    },
  });
}

// Female periond
export function useStartFemalePeriodMutation(handlers: MutationHandlers = {}) {
  // FIXME update cache
  return useMutation<
    StartFemalePeriodResponse,
    Error,
    StartFemalePeriodRequest,
    FemalePeriod
  >({
    mutationKey: StoreKey.startFemalePeriodMutation(),
    mutationFn: wrapApiAction(Schema.days.startFemalePeriod, handlers),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDaysQuery() });

      const createdItem: FemalePeriod = {
        startDate: request.startDate,
      };

      setDaysQueryData(request.startDate, {
        addFemalePeriod: true,
      });

      handlers.onMutate?.();

      return createdItem;
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.startDate, {
          removeFemalePeriod: true,
        });
      }
    },
    onSuccess: (_response, _request) => {
      handlers.onSuccess?.();
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: StoreKeys.listDaysQuery() });
    },
  });
}

export function useDeleteFemalePeriodMutation(handlers: MutationHandlers = {}) {
  // FIXME update cache
  return useMutation<
    DeleteFemalePeriodResponse,
    Error,
    DeleteFemalePeriodRequest,
    {
      removedItem: FemalePeriod;
    }
  >({
    mutationKey: StoreKey.deleteFemalePeriodMutation(),
    mutationFn: wrapApiAction(Schema.days.deleteFemalePeriod, handlers),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDaysQuery() });

      const removedItem: FemalePeriod = {
        startDate: request.startDate,
      };

      setDaysQueryData(request.startDate, {
        removeFemalePeriod: true,
      });

      handlers.onMutate?.();

      return { removedItem };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.removedItem.startDate, {
          addFemalePeriod: true,
        });
      }
    },
    onSuccess: (_response, _request) => {
      handlers.onSuccess?.();
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: StoreKeys.listDaysQuery() });
    },
  });
}

// Cosmetic Product
export function useAddCosmeticProductToDateMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    AddCosmeticProductToDateResponse,
    DefaultError,
    AddCosmeticProductToDateRequest,
    { createdItem: CosmeticProductApplication }
  >({
    mutationKey: StoreKey.addCosmeticProductToDateMutation(),
    mutationFn: wrapApiAction<
      AddCosmeticProductToDateRequest,
      AddCosmeticProductToDateResponse
    >(Schema.days.addCosmeticProduct),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDaysQuery() });

      const createdItem: CosmeticProductApplication = {
        id: Date.now().toString(),
        ...request,
      };

      setDaysQueryData(request.date, {
        addCosmeticProductApplication: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.createdItem.date, {
          removeCosmeticProductApplicationId: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.();

      setDaysQueryData(context.createdItem.date, {
        removeCosmeticProductApplicationId: context.createdItem.id,
        addCosmeticProductApplication: response,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKey.listDaysQuery() });
    },
  });
}

export function useRemoveCosmeticProductFromDateMutation(
  handlers: MutationHandlers = {},
) {
  return useMutation<
    RemoveCosmeticProductFromDateResponse,
    DefaultError,
    CosmeticProductApplication,
    { removedItem: CosmeticProductApplication }
  >({
    mutationKey: StoreKey.deleteCosmeticProductFromDateMutation(),
    mutationFn: data =>
      wrapApiAction<
        RemoveCosmeticProductFromDateRequest,
        RemoveCosmeticProductFromDateResponse
      >(Schema.days.removeCosmeticProduct)({
        date: data.date,
        dayPartId: data.dayPartId,
        cosmeticProductId: data.cosmeticProductId,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDaysQuery() });

      setDaysQueryData(request.date, {
        removeCosmeticProductApplicationId: request.id,
      });

      handlers.onMutate?.();

      return {
        removedItem: request,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.removedItem.date, {
          addCosmeticProductApplication: context.removedItem,
        });
      }
    },
    onSuccess: (_response, _request, _context) => {
      handlers.onSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: StoreKey.listDaysQuery() });
    },
  });
}

// Food
export function useListFoodForDateQuery(date: DateFormat) {
  return useQuery<
    ListFoodMealItemsForDateResponse,
    DefaultError,
    ListFoodMealItemsForDateResponse
  >({
    queryKey: StoreKey.listFoodForDate(),
    queryFn: () => wrapApiAction(Schema.days.listFoodMealItems)({ date }),
  });
}

// FIXME remove
export function useAddFoodToDateMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    AddFoodMealItemToDateResponse,
    DefaultError,
    Omit<FoodMealItem, 'id'>,
    { createdItem: FoodMealItem }
  >({
    mutationKey: StoreKey.addFoodToDate(),
    mutationFn: item => {
      return wrapApiAction<AddFoodMealItemToDateRequest, AddFoodMealItemToDateResponse>(
        Schema.days.addFoodMealItem,
      )({
        date: item.date,
        dayPartId: item.dayPartId,
        item:
          item.food.type === 'product'
            ? {
                type: 'product',
                productId: item.food.productId,
              }
            : {
                type: 'recipe',
                recipeId: item.food.recipeId,
              },
        quantity: item.quantity.value,
        quantityConverterId: item.quantity.converterId,
      });
    },
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listFoodForDate() });

      const createdItem: FoodMealItem = {
        id: Date.now().toString(),
        ...request,
      };

      setDaysQueryData(request.date, {
        addFoodMealItem: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.createdItem.date, {
          removeFoodMealItemId: context.createdItem.id,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.();

      setDaysQueryData(context.createdItem.date, {
        removeFoodMealItemId: context.createdItem.id,
        addFoodMealItem: response,
      });
    },
  });
}

// FIXME remove
export function useUpdateFoodForDateMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateFoodMealItemForDateResponse,
    DefaultError,
    FoodMealItem,
    { oldItem: FoodMealItem }
  >({
    mutationKey: StoreKey.updateFoodForDate(),
    mutationFn: item => {
      return wrapApiAction<
        UpdateFoodMealItemForDateRequest,
        UpdateFoodMealItemForDateResponse
      >(Schema.days.updateFoodMealItem)({
        mealItemId: item.id,
        date: item.date,
        dayPartId: item.dayPartId,
        item:
          item.food.type === 'product'
            ? {
                type: 'product',
                productId: item.food.productId,
              }
            : {
                type: 'recipe',
                recipeId: item.food.recipeId,
              },
        quantity: item.quantity.value,
        quantityConverterId: item.quantity.converterId,
      });
    },
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listFoodForDate() });

      const oldItem: FoodMealItem = {
        ...request,
      };

      setDaysQueryData(request.date, {
        removeFoodMealItemId: oldItem.id,
        addFoodMealItem: oldItem,
      });

      handlers.onMutate?.();

      return {
        oldItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.oldItem.date, {
          removeFoodMealItemId: context.oldItem.id,
          addFoodMealItem: context.oldItem,
        });
      }
    },
    onSuccess: (response, _request, context) => {
      handlers.onSuccess?.();

      setDaysQueryData(context.oldItem.date, {
        removeFoodMealItemId: context.oldItem.id,
        addFoodMealItem: response,
      });
    },
  });
}

// FIXME remove
export function useRemoveFoodFromDateMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    RemoveFoodMealItemFromDateResponse,
    DefaultError,
    FoodMealItem,
    { oldItem: FoodMealItem }
  >({
    mutationKey: StoreKey.deleteFoodFromDate(),
    mutationFn: item => {
      return wrapApiAction<
        RemoveFoodMealItemFromDateRequest,
        RemoveFoodMealItemFromDateResponse
      >(Schema.days.removeFoodMealItem)({
        mealItemId: item.id,
        date: item.date,
        dayPartId: item.dayPartId,
      });
    },
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listFoodForDate() });

      const oldItem: FoodMealItem = {
        ...request,
      };

      setDaysQueryData(request.date, {
        removeFoodMealItemId: oldItem.id,
        addFoodMealItem: oldItem,
      });

      handlers.onMutate?.();

      return {
        oldItem,
      };
    },
    onError: (_error, _request, context) => {
      handlers.onError?.();

      if (context) {
        setDaysQueryData(context.oldItem.date, {
          addFoodMealItem: context.oldItem,
        });
      }
    },
    onSuccess: (_response, _request, context) => {
      handlers.onSuccess?.();

      setDaysQueryData(context.oldItem.date, {
        removeFoodMealItemId: context.oldItem.id,
      });
    },
  });
}

//
//
// --- Day Part ---
export function useCreateDayPartMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    CreateDayPartResponse,
    DefaultError,
    CreateDayPartRequest,
    {
      createdItem: CreateDayPartResponse;
    }
  >({
    mutationKey: StoreKey.createDayPart(),
    mutationFn: wrapApiAction(Schema.days.parts.create),
    onMutate: async (variables: CreateDayPartRequest) => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDayParts() });

      const createdItem: CreateDayPartResponse = {
        id: new Date().toISOString(),
        order: 0,
        ...variables,
      };

      updateDayPartQueries({
        addDayPart: createdItem,
      });

      handlers.onMutate?.();

      return {
        createdItem,
      };
    },
    onSuccess: (response, _request, context) => {
      updateDayPartQueries({
        addDayPart: response,
        removeDayPartId: context.createdItem.id,
      });

      handlers.onSuccess?.();
    },
    onError: (_error, _request, context) => {
      updateDayPartQueries({
        removeDayPartId: context?.createdItem.id,
      });

      handlers.onError?.();
    },
  });
}

export function useUpdateDayPartMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    UpdateDayPartResponse,
    DefaultError,
    {
      oldItem: DayPart;
      newValues: Omit<UpdateDayPartRequest, 'id'>;
    },
    {
      oldItem: DayPart;
      newItem: DayPart;
    }
  >({
    mutationKey: StoreKey.updateDayPart(),
    mutationFn: data =>
      wrapApiAction(Schema.days.parts.update)({
        ...data.newValues,
        id: data.oldItem.id,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDayParts() });

      const newItem: DayPart = {
        ...request.newValues,
        id: Date.now().toString(),
        order: 0,
      };

      updateDayPartQueries({
        removeDayPartId: request.oldItem.id,
        addDayPart: newItem,
      });

      handlers.onMutate?.();

      return {
        newItem,
        oldItem: request.oldItem,
      };
    },
    onSuccess: (response, _request, context) => {
      updateDayPartQueries({
        removeDayPartId: context.newItem.id,
        addDayPart: response,
      });

      handlers.onSuccess?.();
    },
    onError: (_error, _request, context) => {
      updateDayPartQueries({
        removeDayPartId: context?.newItem.id,
        addDayPart: context?.oldItem,
      });

      handlers.onError?.();
    },
  });
}

export function useDeleteDayPartMutation(handlers: MutationHandlers = {}) {
  return useMutation<
    DeleteDayPartResponse,
    DefaultError,
    DayPart,
    {
      removedItem: DayPart;
    }
  >({
    mutationKey: StoreKey.deleteDayPart(),
    mutationFn: wrapApiAction(Schema.days.parts.delete),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKey.listDayParts() });

      updateDayPartQueries({
        removeDayPartId: request.id,
      });

      handlers.onMutate?.();

      return {
        removedItem: request,
      };
    },
    onSuccess: (_response, _request, _context) => {
      handlers.onSuccess?.();
    },
    onError: (_error, _request, context) => {
      updateDayPartQueries({
        addDayPart: context?.removedItem,
      });

      handlers.onError?.();
    },
  });
}

export function useGetDayPartQuery(id: string) {
  return useQuery({
    queryKey: StoreKey.getDayPart(id),
    queryFn: () => wrapApiAction(Schema.days.parts.get)({ id }),
  });
}

export function useListDayPartsQuery() {
  return useQuery({
    queryKey: StoreKey.listDayParts(),
    queryFn: () => wrapApiAction(Schema.days.parts.list)({}),
  });
}

function updateDayPartQueries(arg: { addDayPart?: DayPart; removeDayPartId?: string }) {
  if (arg.removeDayPartId) {
    queryClient.removeQueries({
      queryKey: StoreKey.getDayPart(arg.removeDayPartId),
    });
  }

  if (arg.addDayPart) {
    queryClient.setQueryData(StoreKey.getDayPart(arg.addDayPart.id), arg.addDayPart);
  }

  queryClient.setQueryData<ListDayPartsResponse>(StoreKey.listDayParts(), _old => {
    if (!_old) {
      return _old;
    }

    let old = [..._old];

    if (arg.removeDayPartId) {
      old = old.filter(item => item.id !== arg.removeDayPartId);
    }

    if (arg.addDayPart) {
      old.push(arg.addDayPart);
    }

    return old;
  });
}
