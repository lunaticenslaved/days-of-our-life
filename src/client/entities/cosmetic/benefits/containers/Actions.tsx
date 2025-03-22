import { CosmeticBenefitFormDialog } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitFormDialog';
import {
  useCreateCosmeticBenefitMutation,
  useDeleteCosmeticBenefitMutation,
  useUpdateCosmeticBenefitMutation,
} from '#/client/store';
import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { useDialog } from '#/ui-lib/atoms/Dialog';

import { ActionsComponent } from '../components/Actions';

interface ActionsContainerProps {
  benefit: CosmeticBenefit;
  onDeleted: () => void;
}

export function ActionsContainer({ benefit, onDeleted }: ActionsContainerProps) {
  const createDialog = useDialog();
  const updateDialog = useDialog();

  const createCosmeticBenefitMutation = useCreateCosmeticBenefitMutation({
    onMutate: createDialog.close,
  });
  const updateCosmeticBenefitMutation = useUpdateCosmeticBenefitMutation({
    onMutate: updateDialog.close,
  });
  const deleteCosmeticBenefitMutation = useDeleteCosmeticBenefitMutation({
    onMutate: onDeleted,
  });

  return (
    <>
      <ActionsComponent
        entity={benefit}
        onEdit={updateDialog.open}
        onCreateSubcategory={createDialog.open}
        onDelete={() => {
          deleteCosmeticBenefitMutation.mutate(benefit);
        }}
        disabled={{
          delete: deleteCosmeticBenefitMutation.isPending,
          edit: updateCosmeticBenefitMutation.isPending,
          'create-subcategory': createCosmeticBenefitMutation.isPending,
        }}
        loading={{
          delete: deleteCosmeticBenefitMutation.isPending,
          edit: updateCosmeticBenefitMutation.isPending,
          'create-subcategory': createCosmeticBenefitMutation.isPending,
        }}
      />

      {createDialog.isOpen && (
        <CosmeticBenefitFormDialog
          parentId={benefit.id}
          dialog={createDialog}
          onSubmit={values => {
            createCosmeticBenefitMutation.mutate(values);
          }}
        />
      )}

      {updateDialog.isOpen && (
        <CosmeticBenefitFormDialog
          benefit={benefit}
          dialog={updateDialog}
          onSubmit={values => {
            updateCosmeticBenefitMutation.mutate({
              oldItem: benefit,
              newData: values,
            });
          }}
        />
      )}
    </>
  );
}
