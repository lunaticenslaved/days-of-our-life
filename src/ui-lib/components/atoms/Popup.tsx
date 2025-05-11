import { getBorderStyles } from '#/ui-lib/utils/border';
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
} from '@floating-ui/react';

// TODO add ref, style, className

// --- Popup Context ---------------------------------------------------------------------
interface IPopupContext extends ReturnType<typeof usePopup> {
  floating: ReturnType<typeof useFloating>;
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
};
function Popup({ children, popup: popupProp }: PopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const floating = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const contextValue = useMemo((): IPopupContext => {
    return {
      floating,
      isOpen,
      close: () => {
        popupProp?.close();
        setIsOpen(false);
      },
      open: () => {
        popupProp?.open();
        setIsOpen(true);
      },
      setIsOpen: newValue => {
        popupProp?.setIsOpen(newValue);
        setIsOpen(newValue);
      },
      toggle: () => {
        if (isOpen) {
          popupProp?.close();
          setIsOpen(false);
        } else {
          popupProp?.open();
          setIsOpen(true);
        }
      },
    };
  }, [floating, isOpen, popupProp]);

  return <PopupContext.Provider value={contextValue}>{children}</PopupContext.Provider>;
}

// --- Popup Trigger ---------------------------------------------------------------------
function PopupTrigger({ children }: PropsWithChildren) {
  const { open, floating } = usePopupContext();

  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context);

  const { getReferenceProps } = useInteractions([click, dismiss, role]);

  return (
    <div
      onClick={open}
      style={{ maxWidth: 'max-content' }}
      ref={floating.refs.setReference}
      {...getReferenceProps()}>
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
  const { isOpen, close, floating } = usePopupContext();
  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  if (!isOpen) {
    return null;
  }

  return (
    <FloatingFocusManager context={floating.context}>
      <div
        ref={floating.refs.setFloating}
        style={{
          zIndex: 1_000_000,
          boxShadow: '2px 2px 2px #0005',
          ...getBorderStyles({ borderRadius: 'm' }),
          ...floating.floatingStyles,
        }}
        {...getFloatingProps()}>
        {typeof children === 'function' ? children({ close }) : children}
      </div>
    </FloatingFocusManager>
  );
}
Popup.displayName = 'Popup.Content';

Popup.Trigger = PopupTrigger;
Popup.Content = PopupContent;

export { Popup, usePopup, usePopupContext, type IUsePopup };
