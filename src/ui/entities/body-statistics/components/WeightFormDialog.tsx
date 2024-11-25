import { BodyStatisticsValidators } from '#shared/models/body';
import { Button } from '#ui/components/Button';
import { Dialog, IUseDialog } from '#ui/components/Dialog';
import { FForm } from '#ui/components/FForm';
import { Form } from '#ui/components/Form';
import { NumberInput } from '#ui/components/NumberInput';
import { z } from 'zod';

const schema = z.object({
  weight: BodyStatisticsValidators.weight,
});

type FormValues = z.infer<typeof schema>;

interface BodyWeightFormDialogProps {
  disabled?: boolean;
  weight?: number;
  dialog: IUseDialog;
  onSubmit(values: FormValues): void;
}

export function BodyWeightFormDialog({
  disabled,
  weight,
  dialog,
  onSubmit,
}: BodyWeightFormDialogProps) {
  return (
    <Dialog dialog={dialog}>
      <FForm
        disabled={disabled}
        schema={schema}
        onSubmit={onSubmit}
        initialValues={{ weight }}>
        {() => {
          return (
            <>
              <Dialog.Header>Редактирование веса</Dialog.Header>
              <Dialog.Content>
                <Form.Content>
                  <FForm.Field name="weight">{NumberInput}</FForm.Field>
                </Form.Content>
              </Dialog.Content>

              <Dialog.Footer>
                <Form.Footer>
                  {({ disabled }) => (
                    <Button disabled={disabled} type="submit">
                      Сохранить вес
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
