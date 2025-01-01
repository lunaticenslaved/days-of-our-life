import { queryClient, wrapApiAction } from '#/client/utils/api';
import { DefaultError, QueryKey, useMutation, useQuery } from '@tanstack/react-query';
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
} from '#/shared/api/types/days';
import { MutationHandlers } from '#/client/types';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { MedicamentIntake } from '#/shared/models/medicament';
import { CosmeticProductApplication } from '#/shared/models/cosmetic';
import { cloneDeep } from 'lodash';
import { FemalePeriod } from '#/shared/models/female-period';

const StoreKeys = {
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
  },
) {
  // FIXME set data for getDay request

  queryClient.setQueryData<ListDaysResponse>(StoreKeys.listDaysQuery(), _old => {
    if (!_old) {
      return _old;
    }

    const old = cloneDeep(_old);

    if (!(date in old)) {
      old[date] = { date: date, cosmeticProductApplications: [] };
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
      let startDate = date;

      if (arg.removeFemalePeriod) {
        old[date].femalePeriod = undefined;
        startDate = DateUtils.min(...(Object.keys(old) as DateFormat[]));
      }

      if (arg.addFemalePeriod) {
        startDate = date;

        old[date].femalePeriod = {
          startDate,
        };
      }

      for (const dateStr of Object.keys(old)) {
        const currentDate = dateStr as DateFormat;

        if (DateUtils.isAfter(currentDate, startDate, 'day')) {
          const currentFemalePeriod = old[currentDate].femalePeriod;

          if (
            currentFemalePeriod &&
            DateUtils.isSame(currentFemalePeriod.startDate, currentDate, 'day')
          ) {
            startDate = currentFemalePeriod.startDate;
          }

          old[currentDate].femalePeriod = {
            startDate,
          };
        }
      }
    }

    return old;
  });
}

export function useListDaysQuery(data: ListDaysRequest) {
  return useQuery<ListDaysResponse, DefaultError, ListDaysResponse>({
    queryKey: StoreKeys.listDaysQuery(),
    queryFn: () => wrapApiAction(Schema.days.listDays)(data),
  });
}

export function useGetDayQuery(date: DateFormat) {
  return useQuery<GetDayResponse, DefaultError, GetDayResponse>({
    queryKey: StoreKeys.getDayQuery(),
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
    mutationKey: StoreKeys.createBodyWeightMutation(),
    mutationFn: wrapApiAction(Schema.days.createBodyWeight),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listDaysQuery() });

      const response: CreateBodyWeightResponse = {
        date: request.date,
        weight: request.weight,
      };

      const oldWeight = queryClient.getQueryData<ListDaysResponse>(
        StoreKeys.listDaysQuery(),
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
      queryClient.invalidateQueries({ queryKey: StoreKeys.listDaysQuery() });
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
    mutationKey: StoreKeys.createMedicamentIntakeMutation(),
    mutationFn: wrapApiAction<AddMedicamentToDateRequest, AddMedicamentToDateResponse>(
      Schema.days.createMedicamentIntake,
    ),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listDaysQuery() });

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
      queryClient.invalidateQueries({ queryKey: StoreKeys.listDaysQuery() });
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
    mutationKey: StoreKeys.deleteMedicamentIntakeMutation(),
    mutationFn: data =>
      wrapApiAction<DeleteMedicamentInDateRequest, DeleteMedicamentInDateResponse>(
        Schema.days.deleteMedicamentIntake,
      )({
        date: data.date,
        dayPartId: data.dayPartId,
        medicamentId: data.medicamentId,
      }),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listDaysQuery() });

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
      queryClient.invalidateQueries({ queryKey: StoreKeys.listDaysQuery() });
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
    mutationKey: StoreKeys.startFemalePeriodMutation(),
    mutationFn: wrapApiAction(Schema.days.startFemalePeriod, handlers),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listDaysQuery() });

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
    mutationKey: StoreKeys.deleteFemalePeriodMutation(),
    mutationFn: wrapApiAction(Schema.days.deleteFemalePeriod, handlers),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listDaysQuery() });

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
    mutationKey: StoreKeys.addCosmeticProductToDateMutation(),
    mutationFn: wrapApiAction<
      AddCosmeticProductToDateRequest,
      AddCosmeticProductToDateResponse
    >(Schema.days.addCosmeticProduct),
    onMutate: async request => {
      await queryClient.cancelQueries({ queryKey: StoreKeys.listDaysQuery() });

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
      queryClient.invalidateQueries({ queryKey: StoreKeys.listDaysQuery() });
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
    mutationKey: StoreKeys.deleteCosmeticProductFromDateMutation(),
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
      await queryClient.cancelQueries({ queryKey: StoreKeys.listDaysQuery() });

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
      queryClient.invalidateQueries({ queryKey: StoreKeys.listDaysQuery() });
    },
  });
}
