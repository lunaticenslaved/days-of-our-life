import { DateFormat, DateUtils } from '#/shared/models/date';
import { format } from './utils';
import { FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { WithInputProps } from '#/ui-lib/types';

export type DatePickerSingleProps = WithInputProps<
  DateFormat | undefined,
  {
    onBlur?: FocusEventHandler<HTMLElement>;
    onFocus?: FocusEventHandler<HTMLElement>;
  }
>;

export function DatePickerSingle({
  value: valueProp,
  onValueUpdate,
  ...props
}: DatePickerSingleProps) {
  const [value, _setValue] = useState(valueProp);

  useEffect(() => {
    _setValue(valueProp);
  }, [valueProp]);

  const formattedValue = useMemo(() => {
    if (!value) {
      return undefined;
    }

    return format(value);
  }, [value]);

  const setValue = useCallback(
    (date: Date | null) => {
      const newValue = date ? DateUtils.toDateFormat(date) : undefined;

      _setValue(newValue);
      onValueUpdate?.(newValue);
    },
    [onValueUpdate],
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
