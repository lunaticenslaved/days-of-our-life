import {
  CosmeticINCIIngredient,
  CosmeticProduct,
  CosmeticRecipe,
} from '#/shared/models/cosmetic';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';

export type CosmeticEvents = {
  'product-deleted': { productId: string };
  'product-updated': { product: CosmeticProduct };
  'product-created': { product: CosmeticProduct };

  'recipe-deleted': { recipeId: string };
  'recipe-updated': { recipe: CosmeticRecipe };
  'recipe-created': { recipe: CosmeticRecipe };

  'inci-ingredient-deleted': { ingredientId: string };
  'inci-ingredient-updated': { ingredient: CosmeticINCIIngredient };
  'inci-ingredient-created': { ingredient: CosmeticINCIIngredient };
};

interface ICosmeticEventBus {
  emit: <TKey extends keyof CosmeticEvents>(
    event: TKey,
    arg: CosmeticEvents[TKey],
  ) => void;

  subscribe: <TKey extends keyof CosmeticEvents>(
    event: TKey,
    fn: (arg: CosmeticEvents[TKey]) => void,
  ) => void;

  unsubscribe: <TKey extends keyof CosmeticEvents>(
    event: TKey,
    fn: (arg: CosmeticEvents[TKey]) => void,
  ) => void;
}

const Context = createContext<ICosmeticEventBus | null>(null);

export function CosmeticEventBusProvider({ children }: PropsWithChildren) {
  const listeners = useRef<Record<string, Array<(arg: never) => void>>>({});

  const value: ICosmeticEventBus = {
    emit: (event, arg) => {
      console.log(`EVENT: ${event}. ARG: ${JSON.stringify(arg)}`);
      listeners.current[event]?.forEach(fn => fn(arg as never));
    },
    subscribe: (event, fn) => {
      if (!(event in listeners)) {
        listeners.current[event] = [];
      }

      listeners.current[event].push(fn);
    },
    unsubscribe: (event, fn) => {
      if (!listeners.current[event]?.length) {
        return;
      }

      listeners.current[event] = listeners.current[event].filter(fns => fns !== fn);
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCosmeticEventBusStrict() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Unknown Cosmetic Event Bus!');
  }

  return context;
}
