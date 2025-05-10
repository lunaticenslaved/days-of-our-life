import { z } from 'zod';
import { CommonValidators } from '#/shared/models/common';
import { CosmeticBenefitSingleSelect } from '../Select';
import { Button, Dialog, Form, IDialog, TextInput } from '#/ui-lib/components';

const schema = z.object({
  name: CommonValidators.str(255),
  parentId: CommonValidators.id.optional(),
});

export type FormValues = z.infer<typeof schema>;

interface FormDialogComponentProps {
  dialog: IDialog;
  onSubmit: (values: FormValues) => void;
  disabled: boolean;
  loading: boolean;
  initialValues: FormValues;
  benefitId?: string;
}

export function FormDialogComponent({
  dialog,
  initialValues,
  onSubmit,
  loading,
  disabled,
  benefitId,
}: FormDialogComponentProps) {
  return (
    <Dialog dialog={dialog}>
      <Dialog.Header>
        {benefitId ? 'Редактирование преимущества' : 'Добавление преимущества'}
      </Dialog.Header>
      <Form
        disabled={disabled}
        initialValues={initialValues}
        schema={schema}
        onSubmit={onSubmit}>
        {() => {
          return (
            <form>
              <Dialog.Content>
                <Form.Field name="name">
                  {fieldProps => {
                    return <TextInput {...fieldProps.input} label="Название" />;
                  }}
                </Form.Field>
                <Form.Field name="parentId">
                  {fieldProps => {
                    return (
                      <CosmeticBenefitSingleSelect
                        {...fieldProps}
                        hiddenIds={benefitId ? [benefitId] : undefined}
                      />
                    );
                  }}
                </Form.Field>
              </Dialog.Content>
              <Dialog.Footer>
                <Button type="submit" disabled={disabled} loading={loading}>
                  Сохранить
                </Button>
              </Dialog.Footer>
            </form>
          );
        }}
      </Form>
    </Dialog>
  );
}
