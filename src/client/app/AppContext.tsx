import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface IAppContext {
  api: 'real' | 'test';
}

const Context = createContext<IAppContext | null>(null);

export function AppContextProvider({
  children,
  api,
}: PropsWithChildren & {
  api: 'real' | 'test';
}) {
  const contextValue = useMemo((): IAppContext => {
    return {
      api,
    };
  }, [api]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useAppContextStrict() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('No App Context found!');
  }

  return context;
}
