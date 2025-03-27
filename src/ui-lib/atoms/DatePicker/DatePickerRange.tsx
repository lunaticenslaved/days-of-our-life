import { DateFormat, DateUtils } from '#/shared/models/date';
import dayjs from '#/shared/libs/dayjs';
import { cloneDeep } from 'lodash';
import { FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { format } from './utils';
import { WithInputProps } from '#/ui-lib/types';

// FIXME replace undefined with null
export interface DatePickerRangeValue {
  from?: DateFormat;
  to?: DateFormat;
}

export type DatePickerRangeProps = WithInputProps<
  DatePickerRangeValue | undefined,
  {
    onBlur?: FocusEventHandler<HTMLElement>;
    onFocus?: FocusEventHandler<HTMLElement>;
  }
>;

export function DatePickerRange({
  value: valueProp,
  onValueUpdate,
  ...props
}: DatePickerRangeProps) {
  const [value, _setValue] = useState<Partial<DatePickerRangeValue> | undefined>(() => {
    return cloneDeep(valueProp);
  });

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
        onValueUpdate?.(newValue);
      } else {
        onValueUpdate?.(undefined);
      }
    },
    [onValueUpdate, value],
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
