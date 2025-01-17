import { createContext, ReactNode, useContext, useMemo } from 'react';

type SelectContext =
  | {
      type: 'multiple';
      value?: string[];
    }
  | {
      type: 'single';
      value?: string;
    };

const Context = createContext<SelectContext | null>(null);

type SelectContextProviderProps = {
  children: ReactNode;
} & (
  | {
      type: 'multiple';
      value?: string[];
    }
  | {
      type: 'single';
      value?: string;
    }
);

export function SelectContextProvider({
  children,
  ...props
}: SelectContextProviderProps) {
  const contextValue = useMemo((): SelectContext => {
    return { ...props };
  }, [props]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useSelectContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('SelectContext not found!');
  }

  return context;
}
