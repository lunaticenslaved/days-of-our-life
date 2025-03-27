import { ModelValueProps } from '#/client/types';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

type ComboboxModelValue = ModelValueProps<string[] | undefined>;

//
//
// ------ Combobox Context ---
interface IComboboxContext {
  searchComponent: ReactNode | null;
  setSearchComponent(value: ReactNode | null): void;
}

const ComboboxContext = createContext<IComboboxContext | null>(null);

function useComboboxContext() {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('Unknown Combobox Context');
  }

  return context;
}

//
//
// ------ Combobox Root Component ---
export function Combobox({
  children,
  modelValue,
  onModelValueChange,
}: PropsWithChildren & ComboboxModelValue) {
  const popup = usePopup();
  const rootRef = useRef<HTMLDivElement>(null);

  const searchComponent = useRef<ReactNode>(null);

  const contextValue = useMemo((): IComboboxContext => {
    return {
      searchComponent: null,
      setSearchComponent: value => {
        searchComponent.current = value;
      },
    };
  }, []);

  return (
    <ComboboxContext.Provider value={contextValue}>
      <div ref={rootRef} onClick={popup.open}>
        {children}
      </div>
      {popup.isOpen && <Popup></Popup>}
    </ComboboxContext.Provider>
  );
}

export function ComboboxInput() {
  const comboboxContext = useComboboxContext();

  const content = <TextInput />;

  comboboxContext.setSearchComponent(content);

  return <TextInput />;
}
