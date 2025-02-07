import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayPart } from '#/shared/models/day';
import { DatePicker, DatePickerRangeModelValue } from '#/client/components/DatePicker';
import { useDialog } from '#/client/components/Dialog';
import { MedicamentIntakeFormDialog } from '#/client/entities/medicament/components';
import {
  useCreateMedicamentIntakeMutation,
  useDeleteMedicamentIntakeMutation,
  useListDayPartsQuery,
  useListDaysQuery,
  useListMedicamentsQuery,
} from '#/client/store';
import { Calendar } from '#/client/widgets/Calendar';
import { useEffect, useMemo, useState } from 'react';

export default function PageView() {
  const [dateRange, setDateRange] = useState(() => {
    const now = DateUtils.now();

    return {
      from: DateUtils.toDateFormat(now.subtract(7, 'day')),
      to: DateUtils.toDateFormat(now.add(7, 'day')),
    };
  });

  return (
    <div>
      <CalendarDatePicker
        startDate={dateRange.from}
        endDate={dateRange.to}
        onStartDateChange={from => setDateRange(v => ({ ...v, from }))}
        onEndDateChange={to => setDateRange(v => ({ ...v, to }))}
      />

      <LocalCalendar
        key={`${dateRange.from} - ${dateRange.to}`}
        startDate={dateRange.from}
        endDate={dateRange.to}
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
        if (value?.from && modelValue.from !== value.from) {
          onStartDateChange(value.from);
        }

        if (value?.to && modelValue.to !== value.to) {
          onEndDateChange(value.to);
        }
      }}
    />
  );
}

function LocalCalendar(props: { startDate: DateFormat; endDate: DateFormat }) {
  const medicamentIntakeDialog = useDialog();

  const listDaysQuery = useListDaysQuery(props);

  const listDayPartsQuery = useListDayPartsQuery();
  const listMedicamentsQuery = useListMedicamentsQuery();

  const createMedicamentIntakeMutation = useCreateMedicamentIntakeMutation({
    onMutate: () => {
      medicamentIntakeDialog.close();
    },
  });
  const deleteMedicamentIntakeMutation = useDeleteMedicamentIntakeMutation();

  const [selectedDate, setSelectedDate] = useState<DateFormat>();
  const [selectedDayPart, setSelectedDayPart] = useState<DayPart>();

  useEffect(() => {
    if (!medicamentIntakeDialog.isOpen) {
      setSelectedDayPart(undefined);
      setSelectedDate(undefined);
    }
  }, [medicamentIntakeDialog.isOpen, selectedDayPart]);

  function openIntakeDialog({ date, dayPart }: { date: DateFormat; dayPart: DayPart }) {
    medicamentIntakeDialog.open();
    setSelectedDate(date);
    setSelectedDayPart(dayPart);
  }

  if (!listDayPartsQuery.data || !listMedicamentsQuery.data || !listDaysQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {selectedDate && selectedDayPart && (
        <MedicamentIntakeFormDialog
          type="create"
          date={selectedDate}
          dayPartId={selectedDayPart.id}
          dialog={medicamentIntakeDialog}
          medicaments={listMedicamentsQuery.data || []}
          onSubmit={values => {
            createMedicamentIntakeMutation.mutate({
              date: values.date,
              medicamentId: values.medicamentId,
              dayPartId: values.dayPartId,
            });
          }}
        />
      )}

      <Calendar
        startDate={props.startDate}
        endDate={props.endDate}
        dayParts={listDayPartsQuery.data}
        medicaments={listMedicamentsQuery.data}
        getDayInfo={date => {
          return listDaysQuery.data[date];
        }}
        onMedicamentIntakeDelete={arg => {
          deleteMedicamentIntakeMutation.mutate(arg.intake);
        }}
        onAddMedicamentIntake={arg => {
          openIntakeDialog(arg);
        }}
        onUpdated={() => {}}
      />
    </>
  );
}
