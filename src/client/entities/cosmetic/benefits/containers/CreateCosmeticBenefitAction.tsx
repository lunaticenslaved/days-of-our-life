import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import { CosmeticBenefitFormDialog } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitFormDialog';
import { useCreateCosmeticBenefitMutation } from '#/client/store';

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
