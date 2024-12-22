import { nonReachable } from '#/shared/utils';
import { DatePickerSingle, DatePickerSingleProps } from './DatePickerSingle';
import { DatePickerRange, DatePickerRangeProps } from './DatePickerRange';

export type DatePickerProps =
  | ({
      type: 'single';
    } & DatePickerSingleProps)
  | ({
      type: 'range';
    } & DatePickerRangeProps);

export function DatePicker(props: DatePickerProps) {
  if (props.type === 'single') {
    return <DatePickerSingle {...props} />;
  } else if (props.type === 'range') {
    return <DatePickerRange {...props} />;
  } else {
    nonReachable(props);
  }
}
