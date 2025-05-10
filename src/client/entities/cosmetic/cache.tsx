import {
  CosmeticEvents,
  useCosmeticEventBusStrict,
} from '#/client/entities/cosmetic/event-bus';
import { ItemStore, useItemCache } from '#/client/hooks/cache';
import {
  CosmeticBenefit,
  CosmeticINCIIngredient,
  CosmeticIngredient,
  CosmeticProduct,
  CosmeticRecipe,
} from '#/shared/models/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import _ from 'lodash';
import { createContext, ReactNode, useContext, useEffect } from 'react';

interface ICosmeticStore {
  applications: ItemStore<CosmeticApplication>;
  products: ItemStore<CosmeticProduct>;
  recipes: ItemStore<CosmeticRecipe>;
  inciIngredients: ItemStore<CosmeticINCIIngredient>;
  ingredients: ItemStore<CosmeticIngredient>;
  benefits: ItemStore<CosmeticBenefit>;
}

const Context = createContext<ICosmeticStore | null>(null);

interface CosmeticCacheProviderProps {
  children: ReactNode;
  products?: CosmeticProduct[];
  recipes?: CosmeticRecipe[];
  applications?: CosmeticApplication[];
  inciIngredients?: CosmeticINCIIngredient[];
  ingredients?: CosmeticIngredient[];
  benefits?: CosmeticBenefit[];
}

const getKey = (arg: { id: string }) => arg.id;

export function CosmeticCacheProvider({
  children,
  products,
  recipes,
  applications,
  inciIngredients,
  ingredients,
  benefits,
}: CosmeticCacheProviderProps) {
  const value: ICosmeticStore = {
    applications: useItemCache(getKey, applications),
    products: useItemCache(getKey, products),
    recipes: useItemCache(getKey, recipes),
    inciIngredients: useItemCache(getKey, inciIngredients),
    ingredients: useItemCache(getKey, ingredients),
    benefits: useItemCache(getKey, benefits),
  };

  const eventBus = useCosmeticEventBusStrict();

  useEffect(() => {
    const removeApplicationOnProductDeleted = (
      arg: CosmeticEvents['product-deleted'],
    ) => {
      value.applications
        .list()
        .filter(application => {
          return (
            application.source.type === 'product' &&
            application.source.productId === arg.productId
          );
        })
        .forEach(value.applications.remove);
    };
    const removeApplicationOnRecipeDeleted = (arg: CosmeticEvents['recipe-deleted']) => {
      value.applications
        .list()
        .filter(application => {
          return (
            application.source.type === 'recipe' &&
            application.source.recipeId === arg.recipeId
          );
        })
        .forEach(value.applications.remove);
    };

    eventBus.subscribe('product-deleted', removeApplicationOnProductDeleted);
    eventBus.subscribe('recipe-deleted', removeApplicationOnRecipeDeleted);

    return () => {
      eventBus.unsubscribe('product-deleted', removeApplicationOnProductDeleted);
      eventBus.unsubscribe('recipe-deleted', removeApplicationOnRecipeDeleted);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Context.Provider value={value}>
      <Content>{children}</Content>
    </Context.Provider>
  );
}

function Content({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useCosmeticCacheStrict() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Unknown Cosmetic Cache Context!');
  }

  return context;
}
