import { Button } from '#/ui-lib/atoms/Button';
import { Dialog, IDialog } from '#/ui-lib/atoms/Dialog';

interface ConfirmDialogProps {
  dialog: IDialog;
  title: string;
  text: string;
  submitText: string;
  onSubmit(): void;
  onCancel?(): void;
}

export function ConfirmDialog({
  dialog,
  title,
  text,
  submitText,
  onSubmit,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog dialog={dialog}>
      <Dialog.Header>{title}</Dialog.Header>
      <Dialog.Content>{text}</Dialog.Content>
      <Dialog.Footer>
        <Button
          onClick={() => {
            onCancel?.();
            dialog.close();
          }}>
          Отмена
        </Button>
        <Button onClick={onSubmit}>{submitText}</Button>
      </Dialog.Footer>
    </Dialog>
  );
}
