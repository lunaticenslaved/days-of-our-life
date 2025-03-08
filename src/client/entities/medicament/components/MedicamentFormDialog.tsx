import { CommonValidators } from '#/shared/models/common';
import { Medicament } from '#/shared/models/medicament';
import { TextInput } from '#/client/components/TextInput';
import { Button } from '#/ui-lib/atoms/Button';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { z } from 'zod';
import { Dialog, IDialog } from '#/ui-lib/atoms/Dialog';

const schema = z.object({
  name: CommonValidators.str(255),
});

type FormValues = z.infer<typeof schema>;

interface MedicamentFormDialogProps {
  medicament?: Medicament;
  dialog: IDialog;
  onSubmit(values: FormValues): void;
}

function getInitialValues(medicament?: Medicament): FormValues {
  return {
    name: medicament?.name || '',
  };
}

export function MedicamentFormDialog({
  dialog,
  onSubmit,
  medicament,
}: MedicamentFormDialogProps) {
  return (
    <Dialog dialog={dialog}>
      <FForm
        schema={schema}
        onSubmit={onSubmit}
        initialValues={getInitialValues(medicament)}>
        {() => {
          return (
            <>
              <Dialog.Header>
                {medicament ? 'Редактирование медикаментов' : 'Добавление медикаментов'}
              </Dialog.Header>
              <Dialog.Content>
                <Form.Content>
                  <FForm.Field name="name">{TextInput}</FForm.Field>
                </Form.Content>
              </Dialog.Content>

              <Dialog.Footer>
                <Form.Footer>
                  {({ disabled }) => (
                    <Button disabled={disabled} type="submit">
                      {medicament ? 'Редактировать' : 'Добавить'}
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
