import { ComponentProps } from 'react';
import { useCosmeticBenefitFormDialogContainer } from '../Form';
import { ActionsComponent as CosmeticBenefitActions } from './Actions.component';
import { useDeleteCosmeticBenefitMutation } from '../../queries';
import { useDialog } from '#/ui-lib/components';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

export { CosmeticBenefitActions };

type CosmeticBenefitActionsProps = ComponentProps<typeof CosmeticBenefitActions>;

export function useCosmeticBenefitActionsContainer(
  benefitId: string,
): Pick<
  CosmeticBenefitActionsProps,
  | 'disabled'
  | 'loading'
  | 'createSubcategory'
  | 'update'
  | 'onDelete'
  | 'createSubcategoryDialog'
  | 'updateDialog'
> {
  const cache = useCosmeticCacheStrict();

  const deleting = useDeleteCosmeticBenefitMutation(benefitId);

  const createSubcategoryDialog = useDialog();
  const createSubcategory = useCosmeticBenefitFormDialogContainer({
    type: 'create',
    parentId: benefitId,
    handlers: {
      onSuccess: createSubcategoryDialog.close,
    },
  });

  const benefit = cache.benefits.find(benefitId);
  const updateDialog = useDialog();
  const updating = useCosmeticBenefitFormDialogContainer({
    type: 'update',
    benefit: benefit || {
      id: '',
      name: '',
    },
    handlers: {
      onSuccess: updateDialog.close,
    },
  });

  return {
    createSubcategoryDialog,
    createSubcategory,

    updateDialog,
    update: updating,

    onDelete: benefit => {
      deleting.mutateAsync(benefit);
    },

    disabled: {
      delete: deleting.isPending,
      edit: updating.disabled || deleting.isPending,
      'create-subcategory': createSubcategory.disabled || deleting.isPending,
    },
    loading: {
      delete: deleting.isPending,
      edit: updating.loading,
      'create-subcategory': createSubcategory.loading,
    },
  };
}
