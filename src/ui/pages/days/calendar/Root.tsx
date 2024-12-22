import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayPart } from '#/shared/models/day';
import { MedicamentIntake, MedicamentUtils } from '#/shared/models/medicament';
import { StatisticItem } from '#/shared/models/statistics';
import { DatePicker, DatePickerRangeModelValue } from '#/ui/components/DatePicker';
import { useDialog } from '#/ui/components/Dialog';
import { useListDayPartsQuery } from '#/ui/entities/day-parts';
import {
  useCreateMedicamentIntakeMutation,
  useDeleteMedicamentIntakeMutation,
  useListMedicamentIntakesQuery,
  useListMedicamentsQuery,
  useUpdateMedicamentIntakeMutation,
} from '#/ui/entities/medicament/api';
import { MedicamentIntakeFormDialog } from '#/ui/entities/medicament/components';
import { useListStatisticsQuery } from '#/ui/entities/statistics';
import { Calendar } from '#/ui/widgets/Calendar';
import { keyBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

export default function PageView() {
  const [dateRange, setDateRange] = useState(() => {
    const now = DateUtils.now();

    return {
      from: DateUtils.toDateFormat(now.subtract(7, 'day')),
      to: DateUtils.toDateFormat(now.add(7, 'day')),
    };
  });

  const medicamentIntakeDialog = useDialog();

  const listStatisticsQuery = useListStatisticsQuery({
    startDate: dateRange.from,
    endDate: dateRange.to,
  });
  const listDayPartsQuery = useListDayPartsQuery();
  const listMedicamentsQuery = useListMedicamentsQuery();
  const listMedicamentIntakesQuery = useListMedicamentIntakesQuery({
    startDate: dateRange.from,
    endDate: dateRange.to,
  });
  const createMedicamentIntakeMutation = useCreateMedicamentIntakeMutation({
    onMutate: () => {
      medicamentIntakeDialog.close();
    },
  });
  const updateMedicamentIntakeMutation = useUpdateMedicamentIntakeMutation({
    onMutate: () => {
      medicamentIntakeDialog.close();
    },
  });
  const deleteMedicamentIntakeMutation = useDeleteMedicamentIntakeMutation();

  const [selectedDate, setSelectedDate] = useState<DateFormat>();
  const [selectedDayPart, setSelectedDayPart] = useState<DayPart>();
  const [medicamentIntakeToEdit, setMedicamentIntakeToEdit] =
    useState<MedicamentIntake>();

  const preparedMedicamentIntakes = useMemo(() => {
    const intakes = listMedicamentIntakesQuery.data || [];

    return MedicamentUtils.zipIntakesByDateAndDatePart(intakes);
  }, [listMedicamentIntakesQuery.data]);

  const preparedStatistics = useMemo(() => {
    const statistics = listStatisticsQuery.data || [];

    return keyBy(statistics, item => item.date);
  }, [listStatisticsQuery.data]);

  useEffect(() => {
    if (!medicamentIntakeDialog.isOpen) {
      setMedicamentIntakeToEdit(undefined);
      setSelectedDayPart(undefined);
      setSelectedDate(undefined);
    }
  }, [medicamentIntakeDialog.isOpen, selectedDayPart]);

  function openIntakeDialog({
    date,
    dayPart,
    intake,
  }: {
    date: DateFormat;
    dayPart: DayPart;
    intake?: MedicamentIntake;
  }) {
    medicamentIntakeDialog.open();
    setSelectedDate(date);
    setSelectedDayPart(dayPart);
    setMedicamentIntakeToEdit(intake);
  }

  if (
    !listDayPartsQuery.data ||
    !listMedicamentsQuery.data ||
    !listStatisticsQuery.data
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CalendarDatePicker
        startDate={dateRange.from}
        endDate={dateRange.to}
        onStartDateChange={from => setDateRange({ ...dateRange, from })}
        onEndDateChange={to => setDateRange({ ...dateRange, to })}
      />

      {selectedDate && selectedDayPart && (
        <MedicamentIntakeFormDialog
          type={medicamentIntakeToEdit ? 'edit' : 'create'}
          medicamentId={medicamentIntakeToEdit?.medicamentId}
          date={selectedDate}
          dayPartId={selectedDayPart.id}
          dialog={medicamentIntakeDialog}
          medicaments={listMedicamentsQuery.data || []}
          onSubmit={values => {
            if (medicamentIntakeToEdit) {
              updateMedicamentIntakeMutation.mutate({
                id: medicamentIntakeToEdit.id,
                date: values.date,
                medicamentId: values.medicamentId,
                dayPartId: values.dayPartId,
              });
            } else {
              createMedicamentIntakeMutation.mutate({
                date: values.date,
                medicamentId: values.medicamentId,
                dayPartId: values.dayPartId,
              });
            }
          }}
        />
      )}

      <Calendar
        startDate={dateRange.from}
        endDate={dateRange.to}
        dayParts={listDayPartsQuery.data}
        medicaments={listMedicamentsQuery.data}
        getWeight={date => {
          const statistics: StatisticItem | undefined = preparedStatistics[date];
          return statistics?.body.weight;
        }}
        getNutrients={date => {
          const statistics: StatisticItem | undefined = preparedStatistics[date];
          return statistics?.food.nutrients;
        }}
        getMedicamentIntakes={(date, dayPartId) => {
          const intakes = preparedMedicamentIntakes[date]?.[dayPartId] || [];
          return intakes;
        }}
        onMedicamentIntakeEdit={arg => {
          openIntakeDialog({
            ...arg,
            intake: arg.intake,
          });
        }}
        onMedicamentIntakeDelete={arg => {
          deleteMedicamentIntakeMutation.mutate({
            id: arg.intake.id,
          });
        }}
        onAddMedicamentIntake={arg => {
          openIntakeDialog({
            ...arg,
            intake: undefined,
          });
        }}
      />
    </div>
  );
}

interface CalendarDatePickerProps {
  startDate: DateFormat;
  onStartDateChange(value: DateFormat): void;
  endDate: DateFormat;
  onEndDateChange(value: DateFormat): void;
}

function CalendarDatePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: CalendarDatePickerProps) {
  const modelValue = useMemo((): DatePickerRangeModelValue => {
    return {
      from: startDate,
      to: endDate,
    };
  }, [endDate, startDate]);

  return (
    <DatePicker
      type="range"
      modelValue={modelValue}
      onModelValueChange={value => {
        if (value?.from) {
          onStartDateChange(value.from);
        }

        if (value?.to) {
          onEndDateChange(value.to);
        }
      }}
    />
  );
}
