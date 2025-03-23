import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface IPageContext {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const Context = createContext<IPageContext | null>(null);

export function PageContextProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);

  const contextValue = {
    isLoading,
    setIsLoading,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function usePageContext() {
  return useContext(Context);
}

export function usePageContextStrict() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Page Context not found!');
  }

  return context;
}
