import { Button } from '#/ui-lib/atoms/Button';
import { CosmeticBenefitFormDialog } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitFormDialog';
import { useCreateCosmeticBenefitMutation } from '#/client/store';
import { useDialog } from '#/ui-lib/atoms/Dialog';

export function CreateCosmeticBenefitAction() {
  const createDialog = useDialog();

  const createCosmeticBenefitMutation = useCreateCosmeticBenefitMutation({
    onMutate: createDialog.close,
  });

  return (
    <>
      <Button onClick={createDialog.open}>Создать преимущество</Button>

      {createDialog.isOpen && (
        <CosmeticBenefitFormDialog
          dialog={createDialog}
          onSubmit={values => {
            createCosmeticBenefitMutation.mutate(values);
          }}
        />
      )}
    </>
  );
}
