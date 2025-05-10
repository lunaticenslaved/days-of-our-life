import { Button } from '#/ui-lib/components/atoms/Button/Button';
import {
  CosmeticBenefitFormDialog,
  useCosmeticBenefitFormDialogContainer,
} from '../Form';
import { IDialog } from '#/ui-lib/components/atoms/Dialog';

export function CreatingActionComponent({
  form,
  dialog,
}: {
  dialog: IDialog;
  form: ReturnType<typeof useCosmeticBenefitFormDialogContainer>;
}) {
  return (
    <>
      <Button onClick={dialog.open}>Создать преимущество</Button>

      {dialog.isOpen && <CosmeticBenefitFormDialog {...form} dialog={dialog} />}
    </>
  );
}
