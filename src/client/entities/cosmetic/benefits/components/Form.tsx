import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { TextInput } from '#/client/components/TextInput';
import { z } from 'zod';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { CommonValidators } from '#/shared/models/common';
import { FForm } from '#/client/components/FForm';
import { CosmeticBenefitSingleSelect } from './Select';

const schema = z.object({
  name: CommonValidators.str(255),
  parentId: CommonValidators.id.optional(),
});

export const FormDialog = createEntityFormDialog<
  CosmeticBenefit,
  typeof schema,
  {
    parentId?: string;
    benefit?: CosmeticBenefit;
  }
>({
  schema,
  titleText: {
    create: 'Добавление преимущества',
    update: 'Редактирование преимущества',
  },
  submitText: {
    create: 'Добавить',
    update: 'Редактировать',
  },
  renderFields(_form, { benefit }) {
    return (
      <>
        <FForm.Field name="name">{TextInput}</FForm.Field>
        <FForm.Field name="parentId">
          {fieldProps => {
            return (
              <CosmeticBenefitSingleSelect
                {...fieldProps}
                hiddenIds={benefit ? [benefit.id] : undefined}
              />
            );
          }}
        </FForm.Field>
      </>
    );
  },
  getInitialValues(benefit, { parentId }) {
    return {
      name: benefit?.name || '',
      parentId: parentId || benefit?.parentId,
    };
  },
});
