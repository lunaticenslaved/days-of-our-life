import dayjs from '#shared/libs/dayjs';
import { ModelValueProps } from '#ui/types';
import { FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

interface DatePickerProps extends ModelValueProps<Date> {
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
}

export function DatePicker({
  modelValue: valueProp,
  onModelValueChange,
  ...props
}: DatePickerProps) {
  const [value, _setValue] = useState(valueProp);

  useEffect(() => {
    _setValue(valueProp);
  }, [valueProp]);

  const formattedValue = useMemo(
    () => (value ? dayjs(value).format('YYYY-M-D') : undefined),
    [value],
  );

  const setValue = useCallback(
    (date: Date | null) => {
      const newValue = date ? dayjs(date).toDate() : undefined;

      _setValue(newValue);
      onModelValueChange?.(newValue);
    },
    [onModelValueChange],
  );

  return (
    <input
      {...props}
      type="date"
      value={formattedValue}
      onChange={e => setValue(e.target.valueAsDate)}
    />
  );
}
