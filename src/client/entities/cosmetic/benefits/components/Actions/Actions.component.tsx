import {
  createEntityActions,
  EntityActionsTemplate,
} from '#/client/component-factories/EntityActions';
import {
  CosmeticBenefitFormDialog,
  useCosmeticBenefitFormDialogContainer,
} from '../Form';
import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { IDialog } from '#/ui-lib/components';
import { ComponentProps } from 'react';

type Actions = 'edit' | 'delete' | 'create-subcategory';

const ActionsComponentBase = createEntityActions<CosmeticBenefit, Actions>({
  entityName: 'CosmeticBenefit',
  actions: {
    edit: EntityActionsTemplate.edit,
    delete: EntityActionsTemplate.delete,
    'create-subcategory': {
      text: 'Добавить подкатегорию',
    },
  },
  getActions() {
    return ['edit', 'create-subcategory', 'delete'];
  },
});

type ActionsComponentBaseProps = ComponentProps<typeof ActionsComponentBase>;
type ActionsComponenteProps = Pick<
  ActionsComponentBaseProps,
  'entity' | 'disabled' | 'loading' | 'onDelete'
> & {
  createSubcategory: ReturnType<typeof useCosmeticBenefitFormDialogContainer>;
  update: ReturnType<typeof useCosmeticBenefitFormDialogContainer>;
  createSubcategoryDialog: IDialog;
  updateDialog: IDialog;
};
export function ActionsComponent({
  createSubcategory,
  update,
  createSubcategoryDialog: createDialog,
  updateDialog,
  ...props
}: ActionsComponenteProps) {
  return (
    <>
      <ActionsComponentBase
        {...props}
        onEdit={updateDialog.open}
        onCreateSubcategory={createDialog.open}
      />

      {createDialog.isOpen && (
        <CosmeticBenefitFormDialog {...createSubcategory} dialog={createDialog} />
      )}

      {updateDialog.isOpen && (
        <CosmeticBenefitFormDialog {...update} dialog={updateDialog} />
      )}
    </>
  );
}
