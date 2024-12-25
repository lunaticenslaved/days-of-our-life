import { CommonValidators } from '#/shared/models/common';
import { DateFormat } from '#/shared/models/date';
import { Medicament } from '#/shared/models/medicament';
import { MedicamentSelect } from '#/client/entities/medicament/components/MedicamentSelect';
import { Button } from '#/client/components/Button';
import { Dialog, IUseDialog } from '#/client/components/Dialog';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { z } from 'zod';

const schema = z.object({
  date: CommonValidators.dateFormat,
  medicamentId: CommonValidators.id,
  dayPartId: CommonValidators.id,
});

type FormValues = z.infer<typeof schema>;

export type MedicamentIntakeFormDialogProps = {
  medicaments: Medicament[];
  dialog: IUseDialog;
  onSubmit(values: FormValues): void;
  date: DateFormat;
  dayPartId: string;
  medicamentId?: string;
  type: 'edit' | 'create';
};

function getInitialValues(props: MedicamentIntakeFormDialogProps): FormValues {
  return {
    medicamentId: props.medicamentId || '',
    date: props.date,
    dayPartId: props.dayPartId,
  };
}

export function MedicamentIntakeFormDialog(props: MedicamentIntakeFormDialogProps) {
  const { medicaments, dialog, onSubmit, type: formType } = props;

  return (
    <Dialog dialog={dialog}>
      <FForm schema={schema} onSubmit={onSubmit} initialValues={getInitialValues(props)}>
        {() => {
          return (
            <>
              <Dialog.Header>
                {formType === 'create'
                  ? 'Добавление медикамента'
                  : 'Редактирование медикамента'}
              </Dialog.Header>
              <Dialog.Content>
                <Form.Content>
                  <FForm.Field name="medicamentId">
                    {inputProps => {
                      return (
                        <MedicamentSelect {...inputProps} medicaments={medicaments} />
                      );
                    }}
                  </FForm.Field>
                </Form.Content>
              </Dialog.Content>

              <Dialog.Footer>
                <Form.Footer>
                  {({ disabled }) => (
                    <Button disabled={disabled} type="submit">
                      {formType === 'create' ? 'Добавить' : 'Редактировать'}
                    </Button>
                  )}
                </Form.Footer>
              </Dialog.Footer>
            </>
          );
        }}
      </FForm>
    </Dialog>
  );
}
