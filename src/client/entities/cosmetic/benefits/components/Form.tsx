import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { z } from 'zod';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { CommonValidators } from '#/shared/models/common';
import { FForm } from '#/client/components/FForm';
import { CosmeticBenefitSingleSelect } from './Select';
import { TextInput } from '#/ui-lib/molecules/TextInputField';

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
        <FForm.Field name="name">
          {fieldProps => {
            return (
              <TextInput
                {...fieldProps}
                value={fieldProps.value}
                onValueUpdate={fieldProps.onModelValueChange}
              />
            );
          }}
        </FForm.Field>
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
