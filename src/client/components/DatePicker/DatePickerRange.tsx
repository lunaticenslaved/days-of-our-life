import { DateFormat, DateUtils } from '#/shared/models/date';
import dayjs from '#/shared/libs/dayjs';
import { ModelValueProps } from '#/client/types';
import { cloneDeep } from 'lodash';
import { FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { format } from './utils';

// FIXME replace undefined with null
export interface DatePickerRangeModelValue {
  from?: DateFormat;
  to?: DateFormat;
}

export interface DatePickerRangeProps extends ModelValueProps<DatePickerRangeModelValue> {
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
}

export function DatePickerRange({
  modelValue: valueProp,
  onModelValueChange,
  ...props
}: DatePickerRangeProps) {
  const [value, _setValue] = useState<Partial<DatePickerRangeModelValue> | undefined>(
    () => {
      return cloneDeep(valueProp);
    },
  );

  useEffect(() => {
    _setValue(valueProp);
  }, [valueProp]);

  const formattedValue = useMemo(() => {
    if (!value) {
      return undefined;
    }

    return {
      from: value.from ? format(value.from) : undefined,
      to: value.to ? format(value.to) : undefined,
    };
  }, [value]);

  const setValue = useCallback(
    (date: Date | null, source: 'from' | 'to') => {
      const newDate = date ? dayjs(date).toDate() : undefined;

      let newValue = {
        ...value,
        [source]: newDate ? DateUtils.toDateFormat(newDate) : undefined,
      };

      if (newValue.from && newValue.to) {
        const { from, to } = newValue;

        newValue = {
          from: DateUtils.min(from, to),
          to: DateUtils.max(from, to),
        };
      }

      _setValue(newValue);

      if (newValue.from && newValue.to) {
        onModelValueChange?.(newValue);
      } else {
        onModelValueChange?.(undefined);
      }
    },
    [onModelValueChange, value],
  );

  return (
    <div style={{ display: 'flex' }}>
      <input
        {...props}
        type="date"
        value={formattedValue?.from || ''}
        onChange={e => setValue(e.target.valueAsDate, 'from')}
      />
      <span>-</span>
      <input
        {...props}
        type="date"
        value={formattedValue?.to || ''}
        onChange={e => setValue(e.target.valueAsDate, 'to')}
      />
    </div>
  );
}
