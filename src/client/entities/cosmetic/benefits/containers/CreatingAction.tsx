import { Button } from '#/ui-lib/atoms/Button/Button';
import { FormDialog } from '../components/Form';
import { useCreateCosmeticBenefitMutation } from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';

export function CreatingAction() {
  const createDialog = useDialog();

  const createCosmeticBenefitMutation = useCreateCosmeticBenefitMutation({
    onMutate: createDialog.close,
  });

  return (
    <>
      <Button onClick={createDialog.open}>Создать преимущество</Button>

      {createDialog.isOpen && (
        <FormDialog
          isPending={createCosmeticBenefitMutation.isPending}
          dialog={createDialog}
          onSubmit={values => {
            createCosmeticBenefitMutation.mutate(values);
          }}
        />
      )}
    </>
  );
}
