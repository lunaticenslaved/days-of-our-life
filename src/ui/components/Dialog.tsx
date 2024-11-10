import { Button } from '#ui/components/Button';
import { ReactNode, useId, useMemo, useState } from 'react';

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen(v => !v),
    }),
    [isOpen],
  );
}

export type IUseDialog = ReturnType<typeof useDialog>;

interface DialogProps {
  title: ReactNode;
  body: ReactNode;
  onClose(): void;
  isOpen: boolean;
}

export function Dialog({ isOpen, title, body, onClose }: DialogProps) {
  const titleId = useId();

  return (
    <dialog open={isOpen} aria-labelledby={titleId}>
      <div id={titleId} style={{ display: 'flex' }}>
        <div>{title}</div>
        <div>
          <Button onClick={onClose}>X</Button>
        </div>
      </div>
      <div>{body}</div>
      <div></div>
    </dialog>
  );
}
