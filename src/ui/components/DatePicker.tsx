import dayjs from '#shared/libs/dayjs';
import { useCallback, useMemo, useState } from 'react';

interface DatePickerProps {
  value?: Date;
  onChange(value?: Date): void;
}

export function DatePicker({ value: valueProp, onChange }: DatePickerProps) {
  const [value, _setValue] = useState(valueProp);

  const { formattedValue } = useMemo(
    () => ({
      formattedValue: dayjs(value).format('YYYY-M-D'),
    }),
    [value],
  );

  const setValue = useCallback(
    (date: Date | null) => {
      const newValue = date ? dayjs(date).toDate() : undefined;

      _setValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <input
      type="date"
      value={formattedValue}
      onChange={e => setValue(e.target.valueAsDate)}
    />
  );
}
