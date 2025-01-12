import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import { CosmeticBenefitFormDialog } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitFormDialog';
import {
  useCreateCosmeticBenefitMutation,
  useListCosmeticBenefitsQuery,
} from '#/client/store';

export function CreateCosmeticBenefitAction() {
  const createDialog = useDialog();

  const listCosmeticBenefitsQuery = useListCosmeticBenefitsQuery();

  const createCosmeticBenefitMutation = useCreateCosmeticBenefitMutation({
    onMutate: createDialog.close,
  });

  return (
    <>
      <Button onClick={createDialog.open}>Создать преимущество</Button>

      {createDialog.isOpen && (
        <CosmeticBenefitFormDialog
          benefits={listCosmeticBenefitsQuery.data || []}
          dialog={createDialog}
          onSubmit={values => {
            createCosmeticBenefitMutation.mutate(values);
          }}
        />
      )}
    </>
  );
}
