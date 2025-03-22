import { CommonValidators } from '#/shared/models/common';
import { CosmeticBenefit } from '#/shared/models/cosmetic';
import { TextInput } from '#/client/components/TextInput';
import { Button } from '#/ui-lib/atoms/Button';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { z } from 'zod';
import { useMemo } from 'react';
import { CosmeticBenefitSingleSelect } from './Select';
import { Dialog, IDialog } from '#/ui-lib/atoms/Dialog';

const schema = z.object({
  name: CommonValidators.str(255),
  parentId: CommonValidators.id.optional(),
});

type FormValues = z.infer<typeof schema>;

interface CosmeticBenefitFormDialogProps {
  benefit?: CosmeticBenefit;
  parentId?: string;
  dialog: IDialog;
  onSubmit(values: FormValues): void;
}

function getInitialValues({
  benefit,
  parentId,
}: {
  benefit?: CosmeticBenefit;
  parentId?: string;
}): FormValues {
  return {
    name: benefit?.name || '',
    parentId: parentId || benefit?.parentId,
  };
}

export function CosmeticBenefitFormDialog({
  dialog,
  onSubmit,
  benefit,
  parentId,
}: CosmeticBenefitFormDialogProps) {
  const initialValues = useMemo(() => {
    return getInitialValues({ benefit, parentId });
  }, [benefit, parentId]);

  return (
    <Dialog dialog={dialog}>
      <FForm schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
        {() => {
          return (
            <>
              <Dialog.Header>
                {benefit ? 'Редактирование преимущества' : 'Добавление преимущества'}
              </Dialog.Header>
              <Dialog.Content>
                <Form.Content>
                  <FForm.Field name="name">{TextInput}</FForm.Field>
                  <FForm.Field name="parentId">
                    {fieldProps => {
                      return (
                        <CosmeticBenefitSingleSelect
                          {...fieldProps}
                          hiddenIds={benefit ? [benefit.id] : undefined}
                        />
                      );
                    }}
                  </FForm.Field>
                </Form.Content>
              </Dialog.Content>

              <Dialog.Footer>
                <Form.Footer>
                  {({ disabled }) => (
                    <Button disabled={disabled} type="submit">
                      {benefit ? 'Редактировать' : 'Добавить'}
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
