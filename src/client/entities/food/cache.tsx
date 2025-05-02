import { ItemStore, useItemCache } from '#/client/hooks/cache';
import { FoodProduct, FoodRecipe } from '#/shared/models/food';

import _ from 'lodash';
import { createContext, ReactNode, useContext } from 'react';

interface IFoodStore {
  products: ItemStore<FoodProduct>;
  recipes: ItemStore<FoodRecipe>;
}

const Context = createContext<IFoodStore | null>(null);

interface FoodCacheProviderProps {
  children: ReactNode;
  products?: FoodProduct[];
  recipes?: FoodRecipe[];
}

const getKey = (arg: { id: string }) => arg.id;

export function FoodCacheProvider({
  children,
  products,
  recipes,
}: FoodCacheProviderProps) {
  const value: IFoodStore = {
    products: useItemCache(getKey, products),
    recipes: useItemCache(getKey, recipes),
  };

  return (
    <Context.Provider value={value}>
      <Content>{children}</Content>
    </Context.Provider>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useFoodCacheStrict() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Unknown Food Cache Context!');
  }

  return context;
}
