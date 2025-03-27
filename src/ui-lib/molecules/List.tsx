import { Input } from '#/ui-lib/atoms/Input';
import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// TODO add ref, style, className

interface Item {
  value: string;
  keywords: string[];
  isVisible: boolean;
}

// List Context
interface IListPublicContext {
  search?: string;
  setSearch(value: string): void;

  isSomeItemsVisible: boolean;
}

interface IListContext extends IListPublicContext {
  addItem(arg: Pick<Item, 'keywords' | 'value'>): void;
  removeItem(value: string): void;
  findItem(value: string): Item | undefined;
}

const ListContext = createContext<IListContext | null>(null);

function useListContext() {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('List Context not found!');
  }

  return context;
}

function useListPublicContext(): IListPublicContext {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('List Context not found!');
  }

  return {
    search: context.search,
    setSearch: context.setSearch,
    isSomeItemsVisible: context.isSomeItemsVisible,
  };
}

function isItemVisible(search: string, { keywords }: Pick<Item, 'keywords'>) {
  return !search || keywords.some(keyword => keyword.includes(search));
}

function useRerender() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log('rerendered', counter);
  }, [counter]);

  return useCallback(() => {
    return setCounter(v => v + 1);
  }, []);
}

// --- List ---------------------------------------------------------------------------------
function List({ children }: PropsWithChildren) {
  const rerender = useRerender();

  const searchRef = useRef('');
  const itemsRef = useRef(new Map<string, Item>());
  const visibleCountRef = useRef(0);

  const filterItems = useCallback((newSearch = '') => {
    visibleCountRef.current = 0;

    itemsRef.current.forEach(item => {
      const isVisible = isItemVisible(newSearch, item);

      itemsRef.current.set(item.value, { ...item, isVisible });

      if (isVisible) {
        visibleCountRef.current += 1;
      }
    });
  }, []);

  const { removeItem, findItem, addItem } = useMemo((): Pick<
    IListContext,
    'removeItem' | 'findItem' | 'addItem'
  > => {
    return {
      addItem({ value, ...data }) {
        const isVisible = isItemVisible(searchRef.current, data);

        itemsRef.current.set(value, {
          ...data,
          value,
          isVisible,
        });

        if (isVisible) {
          visibleCountRef.current += 1;
        }

        rerender();
      },
      removeItem(value) {
        itemsRef.current.delete(value);
        visibleCountRef.current -= 1;

        rerender();
      },
      findItem(value) {
        return itemsRef.current.get(value);
      },
    };
  }, [rerender]);

  return (
    <ListContext.Provider
      value={{
        isSomeItemsVisible: visibleCountRef.current > 0,

        search: searchRef.current,
        setSearch: newSearch => {
          searchRef.current = newSearch;

          filterItems(newSearch);
          rerender();
        },

        addItem,
        removeItem,
        findItem,
      }}>
      {children}
    </ListContext.Provider>
  );
}

// --- List Item ----------------------------------------------------------------------------
function ListItem({
  children,
  value,
  keywords,
}: PropsWithChildren & {
  value: string;
  keywords?: string[];
}) {
  const { addItem, removeItem, findItem } = useListContext();

  useEffect(() => {
    return () => {
      removeItem(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let item = findItem(value);

  if (!item) {
    addItem({
      value,
      keywords: keywords || [],
    });
  }

  item = findItem(value);

  if (!item?.isVisible) {
    return null;
  }

  return <li>{children}</li>;
}

// --- List Search --------------------------------------------------------------------------
function ListSearch(props: Pick<ComponentProps<typeof Input>, 'placeholder'>) {
  const { search, setSearch } = useListContext();

  return (
    <Input
      {...props}
      value={search}
      onValueUpdate={newValue => setSearch(newValue || '')}
      debounceMs={500}
    />
  );
}

// --- List Group ---------------------------------------------------------------------------
function ListGroup({ children }: PropsWithChildren) {
  return <ul>{children}</ul>;
}

// --- List Empty ---------------------------------------------------------------------------
function ListEmpty({ children }: PropsWithChildren) {
  const { isSomeItemsVisible } = useListContext();

  return !isSomeItemsVisible ? <div>{children}</div> : null;
}

// --- List Separator -----------------------------------------------------------------------
function ListSeparator() {
  return <hr />;
}

List.Item = ListItem;
List.Search = ListSearch;
List.Group = ListGroup;
List.Empty = ListEmpty;
List.Separator = ListSeparator;

export {
  List,
  useListPublicContext as useListContext,
  type IListPublicContext as IListContext,
};
