import { Box } from '#/ui-lib/components/atoms/Box';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { Input } from '#/ui-lib/components/atoms/Input/Input';
import { Text } from '#/ui-lib/components/atoms/Text';

import { WithInputProps } from '#/ui-lib/types';
import { getBorderStyles } from '#/ui-lib/utils/border';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';
import { TRANSITION_ALL } from '#/ui-lib/utils/transition';
import {
  ComponentProps,
  createContext,
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { StyledObject } from 'styled-components';

// TODO add ref, style, className
// TODO(feature): можно место List.Search сделать List.Filters and another component 'Filter'

interface Item {
  value: string;
  keywords: string[];
  isVisible: boolean;
}

// List Context
interface IListPublicContext {
  value: string[];
  setValue: (newValue: string[]) => void;

  search?: string;
  setSearch: (value: string) => void;

  isSomeItemsVisible: boolean;
}

interface IListContext extends IListPublicContext {
  isSelectable: boolean;
  addItem(arg: Pick<Item, 'keywords' | 'value'>): void;
  removeItem(value: string): void;
  findItem(value: string): Item | undefined;
  isItemSelected: (itemValue: string) => boolean;
  selectItem: (itemValue: string) => void;
  unselectItem: (itemValue: string) => void;
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
    value: context.value,
    setValue: context.setValue,
    search: context.search,
    setSearch: context.setSearch,
    isSomeItemsVisible: context.isSomeItemsVisible,
  };
}

// TODO: может быть получиться сделать поиск получше
function isItemVisible(search: string, { keywords }: Pick<Item, 'keywords'>) {
  return (
    !search ||
    keywords.some(keyword =>
      keyword.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    )
  );
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
function List({
  children,
  value: valueProp,
  onValueUpdate: onValueUpdateProp,
  style,
}: WithInputProps<string[] | undefined, PropsWithChildren & { style?: CSSProperties }>) {
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

  const [value, _setValue] = useState([...(valueProp || [])]);

  const setValue = useCallback(
    (newValue: string[]) => {
      console.log('setValue');
      _setValue(newValue);
      onValueUpdateProp?.(newValue);
    },
    [onValueUpdateProp],
  );

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
      removeItem(itemValue) {
        itemsRef.current.delete(itemValue);
        visibleCountRef.current -= 1;

        if (value.includes(itemValue)) {
          setValue(value.filter(curItemValue => curItemValue !== itemValue));
        }

        rerender();
      },
      findItem(value) {
        return itemsRef.current.get(value);
      },
    };
  }, [rerender, setValue, value]);

  return (
    <ListContext.Provider
      value={{
        isSelectable: !!onValueUpdateProp,

        value,
        setValue,

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
        isItemSelected: itemValue => {
          return value.includes(itemValue);
        },
        selectItem: itemValue => {
          setValue([...value, itemValue]);
        },
        unselectItem: itemValue => {
          setValue(value.filter(curItemValue => curItemValue !== itemValue));
        },
      }}>
      <Flex
        data-component="List"
        direction="column"
        width="100%"
        maxHeight="100%"
        overflow="auto"
        style={style}>
        {children}
      </Flex>
    </ListContext.Provider>
  );
}

// --- List Item ----------------------------------------------------------------------------
function ListItem({
  children,
  value,
  keywords,
  onClick,
}: PropsWithChildren & {
  value: string;
  keywords?: string[];
  onClick?: () => void;
}) {
  const { addItem, findItem, isItemSelected, selectItem, unselectItem, isSelectable } =
    useListContext();

  let item = findItem(value);

  if (!item) {
    addItem({
      value,
      keywords: keywords?.length ? keywords : [value],
    });
  }

  item = findItem(value);

  if (!item?.isVisible) {
    return null;
  }

  const clickHandlers = [
    isSelectable
      ? () => {
          if (isSelected) {
            unselectItem(value);
          } else {
            selectItem(value);
          }
        }
      : undefined,
    onClick,
  ].filter(Boolean);
  const isSelected = isItemSelected(value);

  return (
    <LI
      needAnimateHover={!!onClick || isSelectable}
      onClick={
        clickHandlers.length ? () => clickHandlers.every(fn => fn?.()) : undefined
      }>
      <Flex width="100%" alignItems="center" gap={2}>
        <Box flexGrow={1}>{children}</Box>
        {/* TODO mark selected item with icon */}
        {isSelected && <Box>v</Box>}
      </Flex>
    </LI>
  );
}
const LI = styled.li.withConfig({
  shouldForwardProp: prop => !['needAnimateHover'].includes(prop),
})<{ needAnimateHover: boolean }>(({ needAnimateHover }) => {
  // FIXME move colors in theme

  let styles: StyledObject = {
    padding: 0,
    margin: 0,
    transition: TRANSITION_ALL,
    ...getBorderStyles({ borderRadius: 's' }),
    ...getSpacingStyles({ py: 2 }),
  };

  if (needAnimateHover) {
    styles = {
      ...styles,
      cursor: 'pointer',

      '&:hover': {
        background: 'rgba(255,255,255,0.1)',
        ...getSpacingStyles({ px: 2 }),
      },
    };
  }

  return styles;
});

// --- List Search --------------------------------------------------------------------------
function ListSearch(props: Pick<ComponentProps<typeof Input>, 'placeholder'>) {
  const { search, setSearch } = useListContext();

  return (
    <Box spacing={{ mb: 4 }}>
      <Input
        {...props}
        value={search}
        onValueUpdate={newValue => setSearch(newValue || '')}
        debounceMs={500}
      />
    </Box>
  );
}

// --- List Group ---------------------------------------------------------------------------
function ListGroup({ children }: PropsWithChildren) {
  // FIXME use styled component
  return (
    <ul
      style={{ listStyle: 'none', flexGrow: 1, padding: 0, margin: 0, overflow: 'auto' }}>
      {children}
    </ul>
  );
}

// --- List Empty ---------------------------------------------------------------------------
function ListEmpty({ children }: PropsWithChildren) {
  const { isSomeItemsVisible } = useListContext();

  return !isSomeItemsVisible ? (
    <Box>
      <Text variant="body-s">{children}</Text>
    </Box>
  ) : null;
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
