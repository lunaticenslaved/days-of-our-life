import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type SelectContext = {
  value?: string[] | string;
  setValue: (newValue?: string[] | string) => void;
};

const Context = createContext<SelectContext | null>(null);

type SelectContextProviderProps = {
  children: ReactNode;
} & (
  | {
      type: 'multiple';
      value?: string[];
      onValueUpdate?: (value?: string[]) => void;
    }
  | {
      type: 'single';
      value?: string;
      onValueUpdate?: (value?: string) => void;
    }
);

export function SelectContextProvider({
  children,
  ...props
}: SelectContextProviderProps) {
  const [value, setValue] = useState(() => props.value);

  const contextValue = useMemo((): SelectContext => {
    return {
      value,
      setValue: newValue => {
        setValue(newValue);

        if (props.type === 'multiple') {
          if (newValue && Array.isArray(newValue)) {
            props.onValueUpdate?.(newValue);
          } else if (newValue) {
            props.onValueUpdate?.([newValue]);
          } else {
            props.onValueUpdate?.(undefined);
          }
        } else {
          if (newValue && Array.isArray(newValue)) {
            props.onValueUpdate?.(newValue[0]);
          } else if (newValue) {
            props.onValueUpdate?.(newValue);
          } else {
            props.onValueUpdate?.(undefined);
          }
        }
      },
    };
  }, [props, value]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useSelectContex() {
  return useContext(Context);
}

export function useSelectContextStrict() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('SelectContext not found!');
  }

  return context;
}
