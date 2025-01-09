import { createContext, ReactNode, useContext, useMemo } from 'react';

interface NavigationContext {}

const Context = createContext<NavigationContext | null>(null);

export function useNavigationContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Navigation context not found!');
  }

  return context;
}

interface NavigationContextProviderProps {
  children: ReactNode;
}

export function NavigationContextProvider({ children }: NavigationContextProviderProps) {
  const value = useMemo((): NavigationContext => {
    return {};
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
