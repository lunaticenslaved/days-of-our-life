import {
  CosmeticEvents,
  useCosmeticEventBusStrict,
} from '#/client/entities/cosmetic/event-bus';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import _ from 'lodash';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ItemStore<TItem> = {
  map: Record<string, TItem>;
  add: (item: TItem) => void;
  update: (item: TItem) => void;
  remove: (key: string | TItem) => void;
  find: (key: string) => TItem | undefined;
  get: (key: string) => TItem;
  list: (keys?: string[]) => TItem[];
};

interface ICosmeticStore {
  applications: ItemStore<CosmeticApplication>;
  products: ItemStore<CosmeticProduct>;
  recipes: ItemStore<CosmeticRecipe>;
}

const Context = createContext<ICosmeticStore | null>(null);

interface CosmeticCacheProviderProps {
  children: ReactNode;
  products?: CosmeticProduct[];
  recipes?: CosmeticRecipe[];
  applications?: CosmeticApplication[];
}

const getKey = (arg: { id: string }) => arg.id;

export function CosmeticCacheProvider({
  children,
  products,
  recipes,
  applications,
}: CosmeticCacheProviderProps) {
  const value: ICosmeticStore = {
    applications: useItemCache<CosmeticApplication>(getKey, applications),
    products: useItemCache<CosmeticProduct>(getKey, products),
    recipes: useItemCache<CosmeticRecipe>(getKey, recipes),
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

    eventBus.subscribe('product-deleted', removeApplicationOnProductDeleted);

    return () => {
      eventBus.unsubscribe('product-deleted', removeApplicationOnProductDeleted);
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

function useItemCache<TItem>(
  getKey: (item: TItem) => string,
  initialStore: TItem[] = [],
): ItemStore<TItem> {
  const [map, setMap] = useState<Record<string, TItem>>(() => {
    return initialStore.reduce((acc, item) => {
      return { ...acc, [getKey(item)]: item };
    }, {});
  });

  return useMemo(() => {
    return {
      map,
      add: item => {
        setMap(value => ({ ...value, [getKey(item)]: item }));
      },
      update: item => {
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
      get: (key: string) => {
        return map[key];
      },
      list: keys => {
        if (keys === undefined) {
          return Object.values(map);
        }

        const items: TItem[] = [];

        for (const key of keys) {
          const item = map[key];

          if (item) {
            items.push(item);
          }
        }

        return items;
      },
    };
  }, [getKey, map]);
}
