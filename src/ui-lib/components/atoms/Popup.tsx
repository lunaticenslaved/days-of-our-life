import { useClickOutside } from '#/ui-lib/hooks';
import { getBorderStyles } from '#/ui-lib/utils/border';
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// TODO add ref, style, className

// --- Popup Context ---------------------------------------------------------------------
interface IPopupContext extends ReturnType<typeof usePopup> {
  setRef: (el: Element | null) => void;
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
type PopupProps = PropsWithChildren & {
  popup?: IUsePopup;
  triggerEl?: RefObject<Element>;
};
function Popup({ children, popup: popupProp, triggerEl: triggerElProp }: PopupProps) {
  const popupLocal = usePopup();
  const popup = popupProp || popupLocal;

  const triggerElLocal = useRef<Element | null>(null);

  const contentEl = useRef<Element>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useClickOutside(
    [contentEl, triggerElLocal, ...(triggerElProp ? [triggerElProp] : [])],
    popup.close,
  );

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (popup.isOpen) {
      if (triggerElProp?.current) {
        const { bottom, left } = triggerElProp.current.getBoundingClientRect();

        setPosition({ top: bottom, left });
        setIsOpen(true);
      } else if (triggerElLocal.current) {
        const { bottom, left } = triggerElLocal.current.getBoundingClientRect();

        setPosition({ top: bottom, left });
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [popup.isOpen, triggerElProp]);

  const contextValue = useMemo((): IPopupContext => {
    return {
      ...popup,
      contentEl,
      position,
      isOpen,
      setRef: el => {
        triggerElLocal.current = el;
      },
    };
  }, [isOpen, popup, position]);

  return <PopupContext.Provider value={contextValue}>{children}</PopupContext.Provider>;
}
Popup.displayName = 'Popup';

// --- Popup Trigger ---------------------------------------------------------------------
function PopupTrigger({ children }: PropsWithChildren) {
  const { open, setRef } = usePopupContext();

  return (
    <div onClick={open} style={{ maxWidth: 'max-content' }} ref={setRef}>
      {children}
    </div>
  );
}
Popup.displayName = 'Popup.Trigger';

// --- Popup Content ---------------------------------------------------------------------
function PopupContent({
  children,
}: {
  children: ReactNode | ((arg: { close: () => void }) => ReactNode);
}) {
  const { contentEl, isOpen, position, close } = usePopupContext();

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
        ...getBorderStyles({ borderRadius: 'm' }),
      }}>
      {typeof children === 'function' ? children({ close }) : children}
    </div>
  );
}
Popup.displayName = 'Popup.Content';

Popup.Trigger = PopupTrigger;
Popup.Content = PopupContent;

export { Popup, usePopup, usePopupContext, type IUsePopup };
