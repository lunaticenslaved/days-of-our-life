import { queryClient, wrapApiAction } from '#ui/utils/api';
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
} from '#/shared/api/types/days';
import { Handlers, MutationHandlers } from '#/ui/types';
import { DateFormat } from '#/shared/models/date';
import {} from '#/shared/api/types/medicaments';
import { MedicamentIntake } from '#/shared/models/medicament';

const StoreKeys = {
  getDayQuery: (): QueryKey => ['getDayQuery'],
  listDaysQuery: (): QueryKey => ['listDaysQuery'],
  createBodyWeightMutation: (): QueryKey => ['createBodyWeightMutation'],
  createMedicamentIntakeMutation: (): QueryKey => ['createMedicamentIntakeMutation'],
  deleteMedicamentIntakeMutation: (): QueryKey => ['deleteMedicamentIntakeMutation'],
  startFemalePeriodMutation: (): QueryKey => ['startFemalePeriodMutation'],
  deleteFemalePeriodMutation: (): QueryKey => ['deleteFemalePeriodMutation'],
};

// Days
function setDaysQueryData(
  date: DateFormat,
  arg: {
    weight?: number;
    addMedicamentIntake?: MedicamentIntake;
    removeMedicamentIntakeId?: string;
  },
) {
  // FIXME set data for getDay request

  queryClient.setQueryData<ListDaysResponse>(StoreKeys.listDaysQuery(), _old => {
    if (!_old) {
      return _old;
    }

    const old = { ..._old };

    if (!(date in old)) {
      old[date] = { date: date };
    }

    if (typeof arg.weight === 'number') {
      old[date].weight = arg.weight;
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
export function useStartFemalePeriodMutation(
  handlers: Handlers<StartFemalePeriodResponse> = {},
) {
  // FIXME update cache
  return useMutation<StartFemalePeriodResponse, Error, StartFemalePeriodRequest>({
    mutationKey: StoreKeys.startFemalePeriodMutation(),
    mutationFn: wrapApiAction(Schema.days.startFemalePeriod, handlers),
  });
}

export function useDeleteFemalePeriodMutation(
  handlers: Handlers<DeleteFemalePeriodResponse> = {},
) {
  // FIXME update cache
  return useMutation<DeleteFemalePeriodResponse, Error, DeleteFemalePeriodRequest>({
    mutationKey: StoreKeys.deleteFemalePeriodMutation(),
    mutationFn: wrapApiAction(Schema.days.deleteFemalePeriod, handlers),
  });
}
