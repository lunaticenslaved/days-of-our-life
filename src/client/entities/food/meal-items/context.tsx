import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface IFoodContext {}

const FoodContext = createContext<IFoodContext | null>(null);

export function FoodContextProvider({ children }: PropsWithChildren) {
  const contextValue = useMemo((): IFoodContext => {
    return {};
  }, []);

  return <FoodContext.Provider value={contextValue}>{children}</FoodContext.Provider>;
}

export function useFoodContext() {
  const context = useContext(FoodContext);

  if (!context) {
    throw new Error('No food context found');
  }

  return context;
}

// TODO move here some logic?
