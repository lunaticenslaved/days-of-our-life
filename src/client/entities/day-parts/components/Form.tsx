import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { TextInput } from '#/client/components/TextInput';
import { z } from 'zod';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { CommonValidators } from '#/shared/models/common';
import { FForm } from '#/client/components/FForm';

const schema = z.object({
  name: CommonValidators.str(255),
  parentId: CommonValidators.id.optional(),
});

export const FormDialogComponent = createEntityFormDialog<CosmeticBenefit, typeof schema>(
  {
    schema,
    titleText: {
      create: 'Добавление преимущества',
      update: 'Редактирование преимущества',
    },
    submitText: {
      create: 'Добавить',
      update: 'Редактировать',
    },
    renderFields(_form) {
      return (
        <>
          <FForm.Field title={'Имя'} name="name" required>
            {props => <TextInput {...props} autoFocus />}
          </FForm.Field>
        </>
      );
    },
    getInitialValues(dayPart) {
      return {
        name: dayPart?.name || '',
      };
    },
  },
);
