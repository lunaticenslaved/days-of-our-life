import { Medicament, MedicamentIntake } from '#/shared/models/medicament';
import { z } from 'zod';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { CommonValidators } from '#/shared/models/common';
import { FForm } from '#/client/components/FForm';
import { DateFormat } from '#/shared/models/date';
import { MedicamentSingleSelect } from '#/client/entities/medicaments/medicament';

const schema = z.object({
  date: CommonValidators.dateFormat,
  medicamentId: CommonValidators.id,
  dayPartId: CommonValidators.id,
});

export const FormDialogComponent = createEntityFormDialog<
  MedicamentIntake,
  typeof schema,
  {
    medicaments: Medicament[];
    date: DateFormat;
    dayPartId: string;
    medicamentId?: string;
  }
>({
  schema,
  titleText: {
    create: 'Добавление приёма',
    update: 'Редактирование приёма',
  },
  submitText: {
    create: 'Добавить',
    update: 'Редактировать',
  },
  renderFields(_form, { medicaments }) {
    return (
      <>
        <FForm.Field name="medicamentId">
          {inputProps => {
            return <MedicamentSingleSelect {...inputProps} entities={medicaments} />;
          }}
        </FForm.Field>
      </>
    );
  },
  getInitialValues(_medicament, props) {
    return {
      medicamentId: props.medicamentId || '',
      date: props.date,
      dayPartId: props.dayPartId,
    };
  },
});
