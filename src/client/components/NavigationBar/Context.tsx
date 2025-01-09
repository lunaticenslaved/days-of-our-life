import { createContext, useContext } from 'react';

interface NavigationBarContext {
  value?: string;
  setValue(value?: string): void;
}

export const Context = createContext<NavigationBarContext | null>(null);

export function useNavigationBarContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Navigation bar context not found!');
  }

  return context;
}
