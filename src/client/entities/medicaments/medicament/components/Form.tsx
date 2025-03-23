import { Medicament } from '#/shared/models/medicament';
import { TextInput } from '#/client/components/TextInput';
import { z } from 'zod';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { CommonValidators } from '#/shared/models/common';
import { FForm } from '#/client/components/FForm';

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
          {TextInput}
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
