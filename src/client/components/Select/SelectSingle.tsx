import { SelectContextProvider } from '#/client/components/Select/context';
import { ModelValueProps } from '#/client/types';
import { HTMLProps, useEffect, useState } from 'react';

// TODO add area attributes

export interface SelectSingleProps
  extends Omit<HTMLProps<HTMLSelectElement>, 'multiple' | 'type'>,
    ModelValueProps<string | undefined> {
  multiple?: false;
}

export function SelectSingle({
  children,
  modelValue,
  onModelValueChange,
  ...props
}: SelectSingleProps) {
  const [value, setValue] = useState(modelValue);

  useEffect(() => {
    setValue(modelValue);
  }, [modelValue]);

  return (
    <SelectContextProvider value={modelValue} type="single">
      <select
        {...props}
        onChange={e => {
          onModelValueChange?.(e.target.value);
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
