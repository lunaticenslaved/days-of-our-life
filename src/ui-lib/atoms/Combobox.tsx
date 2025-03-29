import { IUsePopup, Popup, usePopup } from '#/ui-lib/atoms/Popup';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

// --- Combobox Context ---------------------------------------------------------------
interface IComboboxContext {
  popup: IUsePopup;

  search?: string;
  setSearch: (newValue?: string) => void;
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
export function Combobox({ children }: PropsWithChildren) {
  const popup = usePopup();
  const rootRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState<string>();

  const contextValue = useMemo((): IComboboxContext => {
    return {
      popup,
      search,
      setSearch,
    };
  }, [popup, search]);

  return (
    <ComboboxContext.Provider value={contextValue}>
      <Popup popup={popup}>
        <div ref={rootRef} onClick={popup.open}>
          {children}
        </div>
      </Popup>
    </ComboboxContext.Provider>
  );
}

// --- Combobox Trigger -----------------------------------------------------------------
Combobox.Trigger = Popup.Trigger;

// --- Combobox Content -----------------------------------------------------------------
Combobox.Content = Popup.Content;

// --- Combobox Input -------------------------------------------------------------------
function ComboboxInput() {
  const { search, setSearch } = useComboboxContext();

  return <TextInput value={search} onValueUpdate={setSearch} />;
}
ComboboxInput.displayName = 'Combobox.Input';
Combobox.Input = ComboboxInput;
