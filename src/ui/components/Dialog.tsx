import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

export function useDialog() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  const { removeContent } = useDialogContext();

  return useMemo(
    () => ({
      id,
      isOpen,
      open: () => setIsOpen(true),
      close: () => {
        setIsOpen(false);
        removeContent(id);
      },
    }),
    [id, isOpen, removeContent],
  );
}

export type IUseDialog = ReturnType<typeof useDialog>;

interface DialogProps {
  dialog: IUseDialog;
  title: ReactNode;
  body: ReactNode;
}

export function Dialog({ dialog, title, body }: DialogProps) {
  const titleId = useId();
  const { isOpen, close: onClose, id: dialogId } = dialog;

  const { addContent, removeContent, setIsDialogOpen } = useDialogContext();

  useEffect(() => {
    if (isOpen) {
      addContent(dialogId, body);
    } else {
      removeContent(dialogId);
    }

    setIsDialogOpen(isOpen);
  }, [
    addContent,
    body,
    dialogId,
    isOpen,
    onClose,
    removeContent,
    setIsDialogOpen,
    title,
    titleId,
  ]);

  return null;
}

export interface IDialogContext {
  setIsDialogOpen(v: boolean | ((v: boolean) => boolean)): void;
  isDialogOpen: boolean;
  addContent(id: string, content: ReactNode): void;
  removeContent(id: string): void;
}

const DialogContext = createContext<IDialogContext | null>(null);

export function DialogContextProvider({ children }: PropsWithChildren) {
  const [contents, setContents] = useState<Array<{ id: string; content: ReactNode }>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const value = useMemo((): IDialogContext => {
    return {
      isDialogOpen,
      setIsDialogOpen,
      addContent(id, content) {
        setContents(v => {
          const index = v.findIndex(i => i.id === id);

          if (index !== -1) {
            const newV = [...v];

            newV.splice(index, 1, { id, content });

            return newV;
          } else {
            return [...v, { id, content }];
          }
        });
      },
      removeContent(id) {
        setContents(v => v.filter(i => i.id !== id));
      },
    };
  }, [isDialogOpen]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <dialog open={isDialogOpen}>
        {contents.map(({ id, content }, index, arr) => {
          return (
            <div id={id} style={{ display: arr.length - 1 === index ? 'block' : 'none' }}>
              {content}
            </div>
          );
        })}
      </dialog>
    </DialogContext.Provider>
  );
}

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Unknown DialogContext');
  }

  return context;
}
