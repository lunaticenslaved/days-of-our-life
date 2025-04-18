import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { createContext, ReactNode, useContext, useState } from 'react';

type StoredCosmeticProduct = CosmeticProduct;
type StoredCosmeticRecipe = CosmeticRecipe;

type ItemStore<TItem> = {
  map: Record<string, TItem>;
  add: (item: TItem) => void;
  remove: (key: string | TItem) => void;
  find: (key: string) => TItem | undefined;
  list: () => TItem[];
};

interface ICosmeticStore {
  products: ItemStore<StoredCosmeticProduct>;
  recipes: ItemStore<StoredCosmeticRecipe>;
}

const Context = createContext<ICosmeticStore | null>(null);

export function CosmeticCacheProvider({ children }: { children: ReactNode }) {
  const value: ICosmeticStore = {
    products: useItemCache<StoredCosmeticProduct>(item => item.id),
    recipes: useItemCache<StoredCosmeticRecipe>(item => item.id),
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

export function useCosmeticCacheStrict() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Unknown Cosmetic Cache Context!');
  }

  return context;
}

function useItemCache<TItem>(getKey: (item: TItem) => string): ItemStore<TItem> {
  const [map, setMap] = useState<Record<string, TItem>>({});

  return {
    map,
    add: item => {
      setMap(value => ({ ...value, [getKey(item)]: item }));
    },
    remove: item => {
      setMap(value => {
        const newValue = { ...value };

        if (typeof item === 'string') {
          delete newValue[item];
        } else {
          delete newValue[getKey(item)];
        }

        return newValue;
      });
    },
    find: (key: string) => {
      return map[key];
    },
    list: () => {
      return Object.values(map);
    },
  };
}
