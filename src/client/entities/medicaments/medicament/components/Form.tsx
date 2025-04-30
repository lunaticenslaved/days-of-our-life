import { Medicament } from '#/shared/models/medicament';
import { z } from 'zod';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { CommonValidators } from '#/shared/models/common';
import { FForm } from '#/client/components/FForm';
import { TextInput } from '#/ui-lib/molecules/TextInput';

const schema = z.object({
  name: CommonValidators.str(255),
});

export const FormDialogComponent = createEntityFormDialog<Medicament, typeof schema>({
  schema,
  titleText: {
    create: 'Добавление медикамента',
    update: 'Редактирование медикамента',
  },
  submitText: {
    create: 'Добавить',
    update: 'Редактировать',
  },
  renderFields(_form) {
    return (
      <>
        <FForm.Field title={'Имя'} name="name" required>
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
      </>
    );
  },
  getInitialValues(medicament) {
    return {
      name: medicament?.name || '',
    };
  },
});
