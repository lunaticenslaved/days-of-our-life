import { ModelValueProps } from '#/client/types';
import { createContext, HTMLProps, useEffect, useState } from 'react';

// TODO add area attributes

interface SelectContext {
  value?: string;
}

const SelectContext = createContext<SelectContext | null>(null);

export interface SelectProps
  extends HTMLProps<HTMLSelectElement>,
    ModelValueProps<string | undefined> {}

export function Select({
  children,
  modelValue,
  onModelValueChange,
  ...props
}: SelectProps) {
  const [value, setValue] = useState(modelValue);

  useEffect(() => {
    setValue(modelValue);
  }, [modelValue]);

  return (
    <SelectContext.Provider value={{ value }}>
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
    </SelectContext.Provider>
  );
}

interface SelectOptionProps extends HTMLProps<HTMLOptionElement> {}

function SelectOption(props: SelectOptionProps) {
  return <option {...props} />;
}

Select.Option = SelectOption;
