import { createContext, HTMLProps, useEffect, useState } from 'react';

// TODO add area attributes

interface SelectContext {
  value?: string;
}

const SelectContext = createContext<SelectContext | null>(null);

export interface SelectProps extends HTMLProps<HTMLSelectElement> {
  value?: string;
}

export function Select({ children, ...props }: SelectProps) {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <SelectContext.Provider value={{ value }}>
      <select {...props} value={value} style={{ width: '100%' }}>
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
