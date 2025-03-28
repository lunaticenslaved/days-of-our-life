import { useSelectContextStrict } from './context';
import { WithInputProps } from '#/ui-lib/types';
import { CSSProperties, HTMLProps } from 'react';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';
import { THEME } from '#/ui-lib/theme';
import { Size } from '#/ui-lib/utils/size';
import { getHeightStyles } from '#/ui-lib/utils/height';
import { getDimensions } from '#/ui-lib/utils/dimensions';

// TODO add area attributes

// --- Settings ----------------------------------------------------
const SIZE: Size = 'm';

type CommonSelectProps<T> = WithInputProps<
  T,
  Omit<HTMLProps<HTMLSelectElement>, 'multiple'>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStyles(_props: CommonSelectProps<any>): CSSProperties {
  return {
    width: '100%',
    border: 'none',
    borderRadius: getDimensions(THEME.components.input.borderRadius[SIZE]),
    ...getSpacingStyles(THEME.components.select.spacing[SIZE]),
    ...getHeightStyles({ height: THEME.components.select.height[SIZE] }),
  };
}

// --- Single ------------------------------------------------------
type SelectSingleProps = CommonSelectProps<string | undefined> & {
  multiple?: false;
};
export function SelectSingle(props: SelectSingleProps) {
  const selectContext = useSelectContextStrict();

  const { children, value: _value, onValueUpdate: _onValueUpdate, ...otherProps } = props;

  return (
    <select
      {...otherProps}
      value={selectContext.value}
      style={getStyles(props)}
      onChange={e => {
        selectContext.setValue?.(e.target.value);
        props.onChange?.(e);
      }}>
      <option value={undefined} />
      {children}
    </select>
  );
}

// --- Multiple ------------------------------------------------------
type SelectMultipleProps = CommonSelectProps<string[] | undefined> & {
  multiple: true;
};
export function SelectMultiple(props: SelectMultipleProps) {
  const selectContext = useSelectContextStrict();

  const { children, value: _value, onValueUpdate: _onValueUpdate, ...otherProps } = props;

  return (
    <select
      {...otherProps}
      multiple
      value={selectContext.value}
      style={getStyles(props)}
      onChange={e => {
        const newValue = Array.from(e.target.querySelectorAll('option'))
          .filter(option => option.selected)
          .map(option => option.value);

        selectContext.setValue?.(newValue);
        props.onChange?.(e);
      }}>
      <option value={undefined} />
      {children}
    </select>
  );
}

// --- Option ------------------------------------------------------------
export function SelectOption(props: HTMLProps<HTMLOptionElement>) {
  return <option {...props} />;
}
