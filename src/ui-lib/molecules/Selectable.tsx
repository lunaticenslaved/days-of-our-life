import { InputProps } from '#/ui-lib/types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// --- Context ---------------------------------------------------------------
interface SelectableContext {
  value?: string;
  setValue: (value?: string) => void;
}

const Context = createContext<SelectableContext | null>(null);

export function useSelectableContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('SelectableContext not found!');
  }

  return context;
}

// --- Selectable Root ------------------------------------------------------------------
type SelectableProps = Partial<InputProps<string | undefined>> & {
  children: ReactNode;
};
export function Selectable({
  value: valueProp,
  onValueUpdate,
  children,
}: SelectableProps) {
  const [value, _setValue] = useState(valueProp);

  useEffect(() => {
    _setValue(valueProp);
  }, [valueProp]);

  const setValue = useCallback(
    (newValue?: string) => {
      onValueUpdate?.(newValue);
      _setValue(newValue);
    },
    [onValueUpdate],
  );

  return <Context.Provider value={{ value, setValue }}>{children}</Context.Provider>;
}

// --- Selectable Item ------------------------------------------------------------------
type SelectableItemProps = {
  value: string;
  children: ((arg: { isActive: boolean }) => ReactNode) | ReactNode;
};
function SelectableItem({ value, children }: SelectableItemProps) {
  const context = useSelectableContext();

  return (
    <div
      style={{ display: 'contents' }}
      onClick={() => {
        context.setValue(value);
      }}>
      {typeof children === 'function'
        ? children({ isActive: context.value === value })
        : children}
    </div>
  );
}

Selectable.Item = SelectableItem;
