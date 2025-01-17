import { SelectContextProvider } from '#/client/components/Select/context';
import { ModelValueProps } from '#/client/types';
import { HTMLProps, useEffect, useState } from 'react';

// TODO add area attributes

export interface SelectMultipleProps
  extends Omit<HTMLProps<HTMLSelectElement>, 'multiple' | 'type'>,
    ModelValueProps<string[] | undefined> {
  multiple: true;
}

export function SelectMultiple({
  children,
  modelValue,
  onModelValueChange,
  ...props
}: SelectMultipleProps) {
  const [value, setValue] = useState(modelValue);

  useEffect(() => {
    setValue(modelValue);
  }, [modelValue]);

  return (
    <SelectContextProvider value={modelValue} type="multiple">
      <select
        {...props}
        multiple
        onChange={e => {
          const newValue = Array.from(e.target.querySelectorAll('option'))
            .filter(option => option.selected)
            .map(option => option.value);

          onModelValueChange?.(newValue);
          props.onChange?.(e);
        }}
        value={value}
        style={{ width: '100%' }}>
        <option value={undefined} />
        {children}
      </select>
    </SelectContextProvider>
  );
}
