import { BodyStatisticsValidators } from '#/shared/models/body';
import { Button, Dialog, IDialog, NumberInput } from '#/ui-lib/components';
import { FForm } from '#/client/components/FForm';
import { z } from 'zod';

const schema = z.object({
  weight: BodyStatisticsValidators.weight,
});

type FormValues = z.infer<typeof schema>;

interface BodyWeightFormDialogProps {
  disabled?: boolean;
  weight?: number;
  dialog: IDialog;
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
                <FForm.Field name="weight">
                  {fieldProps => {
                    return (
                      <NumberInput
                        {...fieldProps}
                        value={fieldProps.value}
                        onValueUpdate={fieldProps.onModelValueChange}
                      />
                    );
                  }}
                </FForm.Field>
              </Dialog.Content>

              <Dialog.Footer>
                <Button disabled={disabled} type="submit">
                  Сохранить вес
                </Button>
              </Dialog.Footer>
            </>
          );
        }}
      </FForm>
    </Dialog>
  );
}
