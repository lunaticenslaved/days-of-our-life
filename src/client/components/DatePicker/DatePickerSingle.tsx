import { DateFormat, DateUtils } from '#/shared/models/date';
import { format } from './utils';
import { ModelValueProps } from '#/client/types';
import { FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

export interface DatePickerSingleProps extends ModelValueProps<DateFormat> {
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
}

export function DatePickerSingle({
  modelValue: valueProp,
  onModelValueChange,
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
