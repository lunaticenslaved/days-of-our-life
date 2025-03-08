import { Button } from '#/ui-lib/atoms/Button';
import {
  createContext,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export function useDialog() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  const { updateDialogState } = useDialogContext();

  return useMemo(
    () => ({
      id,
      isOpen,
      open: () => {
        updateDialogState(id, { isOpen: true });
        setIsOpen(true);
      },
      close: () => {
        updateDialogState(id, { isOpen: false });
        setIsOpen(false);
      },
    }),
    [id, isOpen, updateDialogState],
  );
}

export type IDialog = ReturnType<typeof useDialog>;

interface DialogProps extends PropsWithChildren {
  dialog: IDialog;
}

export function Dialog({ dialog, children }: DialogProps) {
  const { id: dialogId } = dialog;

  const { registerDialog, unregisterDialog } = useDialogContext();

  useEffect(() => {
    registerDialog({ id: dialogId, content: children, interface: dialog });

    return () => {
      unregisterDialog(dialogId);
    };
  }, [children, dialog, dialogId, registerDialog, unregisterDialog]);

  return null;
}

function DialogHeader({ children }: PropsWithChildren) {
  return (
    <div style={{ padding: '20px', borderBottom: '1px solid grey' }}>{children}</div>
  );
}

function DialogContent(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} style={{ padding: '20px', ...props.style }} />;
}

function DialogFooter({ children }: PropsWithChildren) {
  return <div style={{ padding: '20px', borderTop: '1px solid grey' }}>{children}</div>;
}

Dialog.Header = DialogHeader;
Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;

interface IDialogContext {
  registerDialog(item: DialogItem): void;
  unregisterDialog(itemId: string): void;
  updateDialogState(itemId: string, arg: { isOpen: boolean }): void;
}

const DialogContext = createContext<IDialogContext | null>(null);

interface DialogItem {
  id: string;
  content: ReactNode;
  interface: IDialog;
}

export function DialogContextProvider({ children }: PropsWithChildren) {
  const [dialogs, setDialogs] = useState<DialogItem[]>([]);
  const [openDialogIds, setOpenDialogIds] = useState<string[]>([]);

  const value = useMemo((): IDialogContext => {
    return {
      updateDialogState: (itemId: string, arg: { isOpen: boolean }) => {
        if (arg.isOpen) {
          setOpenDialogIds(v => [...v.filter(id => id !== itemId), itemId]);
        } else {
          setOpenDialogIds(v => v.filter(id => id !== itemId));
        }
      },
      registerDialog: (item: DialogItem) => {
        setDialogs(v => [...v, item]);
      },
      unregisterDialog: (itemId: DialogItem['id']) => {
        setDialogs(v => v.filter(i => i.id !== itemId));
      },
    };
  }, []);

  const currentOpenDialog = dialogs.find(
    d => d.id == openDialogIds[openDialogIds.length - 1],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      {currentOpenDialog &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              height: '100vh',
              width: '100vw',
              top: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
            <dialog open style={{ position: 'relative', padding: '0', border: 'none' }}>
              <Button
                view="clear"
                style={{ position: 'absolute', right: '-40px' }}
                onClick={currentOpenDialog.interface.close}>
                X
              </Button>

              <div>
                {dialogs.map(({ id, content }) => {
                  const isOpen = currentOpenDialog.id === id;

                  return (
                    <div id={id} key={id} style={{ display: isOpen ? 'block' : 'none' }}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </dialog>
          </div>,
          document.body,
        )}
    </DialogContext.Provider>
  );
}

function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Unknown DialogContext');
  }

  return context;
}
