import { Popup, usePopup } from '#/ui-lib/molecules/Popup';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { WithInputProps } from '#/ui-lib/types';
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

type ComboboxModelValue = WithInputProps<string[] | undefined>;

// --- Combobox Context ---------------------------------------------------------------
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

// --- Combobox Root Component ---------------------------------------------------------
export function Combobox({
  children,
  value,
  onValueUpdate,
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

      <Popup popup={popup}>
        <Popup.Content></Popup.Content>
      </Popup>
    </ComboboxContext.Provider>
  );
}

// --- Combobox Input -------------------------------------------------------------------
function ComboboxInput() {
  const comboboxContext = useComboboxContext();

  const content = <TextInput />;

  comboboxContext.setSearchComponent(content);

  return <TextInput />;
}
ComboboxInput.displayName = 'Combobox.Input';
Combobox.Input = ComboboxInput;
