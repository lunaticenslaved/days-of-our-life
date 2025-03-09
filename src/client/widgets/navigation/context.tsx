import { SubNavigationItem } from '#/client/widgets/navigation/types';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface NavigationContext {
  subNavigationItems: SubNavigationItem[];
  setSubNavigation: (items: SubNavigationItem[]) => void;
  removeSubNavigation: () => void;
}

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
  const [subNavigationItems, setSubNavigationItems] = useState<SubNavigationItem[]>([]);

  const value = useMemo((): NavigationContext => {
    return {
      subNavigationItems,
      setSubNavigation(items) {
        setSubNavigationItems(items);
      },
      removeSubNavigation() {
        setSubNavigationItems([]);
      },
    };
  }, [subNavigationItems]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
