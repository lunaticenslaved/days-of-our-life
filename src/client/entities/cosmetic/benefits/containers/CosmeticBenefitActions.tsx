import { Button } from '#/ui-lib/atoms/Button';
import { ConfirmDialog } from '#/client/components/ConfirmDialog';
import { CosmeticBenefitFormDialog } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitFormDialog';
import {
  useCreateCosmeticBenefitMutation,
  useDeleteCosmeticBenefitMutation,
  useUpdateCosmeticBenefitMutation,
} from '#/client/store';
import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { useDialog } from '#/ui-lib/atoms/Dialog';

interface CosmeticBenefitActionsProps {
  benefit: CosmeticBenefit;
}

export function CosmeticBenefitActions({ benefit }: CosmeticBenefitActionsProps) {
  const createDialog = useDialog();
  const updateDialog = useDialog();
  const deleteDialog = useDialog();

  const createCosmeticBenefitMutation = useCreateCosmeticBenefitMutation({
    onMutate: createDialog.close,
  });
  const updateCosmeticBenefitMutation = useUpdateCosmeticBenefitMutation({
    onMutate: updateDialog.close,
  });
  const deleteCosmeticBenefitMutation = useDeleteCosmeticBenefitMutation({
    onMutate: deleteDialog.close,
  });

  return (
    <>
      <Button onClick={updateDialog.open}>Редактировать</Button>
      <Button onClick={createDialog.open}>Добавить подкатегорию</Button>
      <Button onClick={deleteDialog.open}>Удалить</Button>

      {createDialog.isOpen && (
        <CosmeticBenefitFormDialog
          parentId={benefit.id}
          dialog={createDialog}
          onSubmit={values => {
            createCosmeticBenefitMutation.mutate(values);
          }}
        />
      )}

      {deleteDialog.isOpen && (
        <ConfirmDialog
          dialog={deleteDialog}
          title="Удалить преимущество"
          text="Вы уверены, что хотите удалить преимущество?"
          submitText="Удалить"
          onSubmit={() => {
            deleteCosmeticBenefitMutation.mutate(benefit);
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
