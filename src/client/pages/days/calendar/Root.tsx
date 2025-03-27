import { DateFormat, DateUtils } from '#/shared/models/date';
import { DatePicker, DatePickerRangeValue } from '#/ui-lib/atoms/DatePicker';
import { useListDayPartsQuery, useListDaysQuery } from '#/client/store';
import { Calendar } from '#/client/widgets/Calendar';
import { useMemo, useState } from 'react';

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
  const modelValue = useMemo((): DatePickerRangeValue => {
    return {
      from: startDate,
      to: endDate,
    };
  }, [endDate, startDate]);

  return (
    <DatePicker
      type="range"
      value={modelValue}
      onValueUpdate={value => {
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
  const listDaysQuery = useListDaysQuery(props);

  const listDayPartsQuery = useListDayPartsQuery();

  if (!listDayPartsQuery.data || !listDaysQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Calendar
        startDate={props.startDate}
        endDate={props.endDate}
        dayParts={listDayPartsQuery.data}
        getDayInfo={date => {
          return listDaysQuery.data[date];
        }}
        onUpdated={() => {}}
      />
    </>
  );
}
