import { Button } from '#/ui-lib/atoms/Button';
import { Dialog, IDialog } from '#/ui-lib/atoms/Dialog';
import { usePendingCall } from '#/ui-lib/hooks';

interface ConfirmDialogProps {
  dialog: IDialog;
  title: string;
  text: string;
  submitText: string;
  onSubmit(): void | Promise<void>;
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
  const [isPending, pendingCall] = usePendingCall(onSubmit);

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
        <Button disabled={isPending} loading={isPending} onClick={pendingCall}>
          {submitText}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
