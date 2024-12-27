import { CommonValidators } from '#/shared/models/common';
import { DayPart } from '#/shared/models/day';
import { Button } from '#/client/components/Button';
import { Dialog, IUseDialog } from '#/client/components/Dialog';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { TextInput } from '#/client/components/TextInput';
import { z } from 'zod';

const schema = z.object({
  name: CommonValidators.str(255),
});

type DayPartFormValues = z.infer<typeof schema>;

interface DayPartFromDialogProps {
  dialog: IUseDialog;
  onSubmit(values: DayPartFormValues): void;
  dayPart?: Pick<DayPart, 'name'>;
}

export function DayPartFormDialog({ dayPart, dialog, onSubmit }: DayPartFromDialogProps) {
  return (
    <Dialog dialog={dialog}>
      <FForm
        schema={schema}
        onSubmit={onSubmit}
        initialValues={{ name: dayPart?.name || '' }}>
        {() => {
          return (
            <>
              <Dialog.Header>Период дня</Dialog.Header>
              <Dialog.Content>
                <Form.Content>
                  <FForm.Field title={'Имя'} name="name" required>
                    {props => <TextInput {...props} autoFocus />}
                  </FForm.Field>
                </Form.Content>
              </Dialog.Content>
              <Dialog.Footer>
                <Form.Footer>
                  {({ disabled }) => {
                    return (
                      <Button disabled={disabled} type="submit">
                        Добавить
                      </Button>
                    );
                  }}
                </Form.Footer>
              </Dialog.Footer>
            </>
          );
        }}
      </FForm>
    </Dialog>
  );
}
