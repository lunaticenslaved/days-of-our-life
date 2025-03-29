import { useClickOutside } from '#/ui-lib/hooks';
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

// TODO add ref, style, className

// --- Popup Context ---------------------------------------------------------------------
interface IPopupContext extends ReturnType<typeof usePopup> {
  triggerEl: RefObject<Element>;
  contentEl: RefObject<Element>;
  position: {
    top: number;
    left: number;
  };
}

const PopupContext = createContext<IPopupContext | null>(null);

function usePopupContext() {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error('No Popup Context found');
  }

  return context;
}

function usePopup(arg: { isOpen?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(!!arg.isOpen);

  return useMemo(() => {
    return {
      isOpen,
      setIsOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen(value => !value),
    };
  }, [isOpen]);
}
type IUsePopup = ReturnType<typeof usePopup>;

// --- Popup Root -----------------------------------------------------------------------
type PopupProps = PropsWithChildren & { popup?: IUsePopup };
function Popup({ children, popup: popupProp }: PopupProps) {
  const popupLocal = usePopup();
  const popup = popupProp || popupLocal;

  const triggerEl = useRef<Element>(null);
  const contentEl = useRef<Element>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useClickOutside([contentEl, triggerEl], popup.close);

  const contextValue = useMemo((): IPopupContext => {
    return {
      ...popup,
      triggerEl,
      contentEl,
      position,
      open: () => {
        if (triggerEl.current) {
          const { bottom, left } = triggerEl.current.getBoundingClientRect();

          setPosition({ top: bottom, left });
          popup.open();
        }
      },
    };
  }, [popup, position]);

  return <PopupContext.Provider value={contextValue}>{children}</PopupContext.Provider>;
}
Popup.displayName = 'Popup';

// --- Popup Trigger ---------------------------------------------------------------------
function PopupTrigger({ children }: PropsWithChildren) {
  const { open, triggerEl } = usePopupContext();

  return (
    <div onClick={open} ref={triggerEl as RefObject<HTMLDivElement>}>
      {children}
    </div>
  );
}
Popup.displayName = 'Popup.Trigger';

// --- Popup Content ---------------------------------------------------------------------
function PopupContent({ children }: PropsWithChildren) {
  const { contentEl, isOpen, position } = usePopupContext();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={contentEl as RefObject<HTMLDivElement>}
      style={{
        position: 'absolute',
        zIndex: 1_000_000,
        top: `${position.top}px`,
        left: `${position.left}px`,
        boxShadow: '2px 2px 2px #0005',
      }}>
      {children}
    </div>
  );
}
Popup.displayName = 'Popup.Content';

Popup.Trigger = PopupTrigger;
Popup.Content = PopupContent;

export { Popup, usePopup, usePopupContext, type IUsePopup };
