import { useSelectContextStrict } from './context';
import { WithInputProps } from '#/ui-lib/types';
import { HTMLProps } from 'react';

// TODO add area attributes

// --- Single ------------------------------------------------------
type SelectSingleProps = WithInputProps<
  string | undefined,
  Omit<HTMLProps<HTMLSelectElement>, 'multiple' | 'type'>
> & {
  multiple?: false;
};

export function SelectSingle({
  children,
  value: _value,
  onValueUpdate: _onValueUpdate,
  ...props
}: SelectSingleProps) {
  const selectContext = useSelectContextStrict();

  return (
    <select
      {...props}
      onChange={e => {
        selectContext.setValue?.(e.target.value);
        props.onChange?.(e);
      }}
      value={selectContext.value}
      style={{ width: '100%' }}>
      <option value={undefined} />
      {children}
    </select>
  );
}

// --- Multiple ------------------------------------------------------
type SelectMultipleProps = WithInputProps<
  string[] | undefined,
  Omit<HTMLProps<HTMLSelectElement>, 'multiple' | 'type'>
> & {
  multiple: true;
};

export function SelectMultiple({
  children,
  value: _value,
  onValueUpdate: _onValueUpdate,
  ...props
}: SelectMultipleProps) {
  const selectContext = useSelectContextStrict();

  return (
    <select
      {...props}
      multiple
      onChange={e => {
        const newValue = Array.from(e.target.querySelectorAll('option'))
          .filter(option => option.selected)
          .map(option => option.value);

        selectContext.setValue?.(newValue);
        props.onChange?.(e);
      }}
      value={selectContext.value}
      style={{ width: '100%' }}>
      <option value={undefined} />
      {children}
    </select>
  );
}

// --- Option ------------------------------------------------------------
export function SelectOption(props: HTMLProps<HTMLOptionElement>) {
  return <option {...props} />;
}
