import _ from 'lodash';
import { useMemo, useState } from 'react';

export type ItemStore<TItem> = {
  map: Record<string, TItem>;
  add: (item: TItem) => void;
  update: (item: TItem) => void;
  remove: (key: string | TItem) => void;
  find: (key: string) => TItem | undefined;
  get: (key: string) => TItem;
  list: (keys?: string[]) => TItem[];
};

export function useItemCache<TItem>(
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
        setMap(value => {
          const key = getKey(item);

          const oldItem = value[key];
          const newItem = _.merge(oldItem, item);

          return { ...value, [key]: newItem };
        });
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
