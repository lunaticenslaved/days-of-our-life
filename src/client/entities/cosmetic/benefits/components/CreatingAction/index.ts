import { ComponentProps } from 'react';
import { CreatingActionComponent } from './CreatingAction.component';
import { useDialog } from '#/ui-lib/components';
import { useCosmeticBenefitFormDialogContainer } from '#/client/entities/cosmetic/benefits/components/Form';

type CreatingActionComponentProps = ComponentProps<typeof CreatingActionComponent>;

export { CreatingActionComponent as CosmeticBenefitCreatingAction };

export function useCosmeticBenefitCreatingActionContainer(): Pick<
  CreatingActionComponentProps,
  'dialog' | 'form'
> {
  const dialog = useDialog();

  return {
    dialog,
    form: useCosmeticBenefitFormDialogContainer({
      type: 'create',
      handlers: {
        onSuccess: dialog.close,
      },
    }),
  };
}
