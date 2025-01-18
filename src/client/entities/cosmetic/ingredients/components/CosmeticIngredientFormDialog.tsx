import { CommonValidators } from '#/shared/models/common';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { TextInput } from '#/client/components/TextInput';
import { Button } from '#/client/components/Button';
import { Dialog, IUseDialog } from '#/client/components/Dialog';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { z } from 'zod';
import { useMemo } from 'react';
import { CosmeticBenefitMultipleSelect } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitSelect';
import { useListCosmeticBenefitsQuery } from '#/client/store';

const schema = z.object({
  name: CommonValidators.str(255),
  benefitIds: z
    .array(CommonValidators.id)
    .min(1, 'Укажите хотя бы одно направление действия'),
});

type FormValues = z.infer<typeof schema>;

interface CosmeticIngredientFormDialogProps {
  ingredient?: CosmeticIngredient;
  dialog: IUseDialog;
  onSubmit(values: FormValues): void;
}

function getInitialValues({
  ingredient,
}: {
  ingredient?: CosmeticIngredient;
}): FormValues {
  return {
    name: ingredient?.name || '',
    benefitIds: ingredient?.benefitIds || [],
  };
}

export function CosmeticIngredientFormDialog({
  dialog,
  onSubmit,
  ingredient,
}: CosmeticIngredientFormDialogProps) {
  const { isFetching } = useListCosmeticBenefitsQuery(false);

  const initialValues = useMemo(() => {
    return getInitialValues({ ingredient });
  }, [ingredient]);

  return (
    <Dialog dialog={dialog}>
      <FForm
        schema={schema}
        onSubmit={onSubmit}
        initialValues={initialValues}
        disabled={isFetching}>
        {() => {
          return (
            <>
              <Dialog.Header>
                {ingredient ? 'Редактирование ингредиента' : 'Добавление ингредиента'}
              </Dialog.Header>
              <Dialog.Content>
                <Form.Content>
                  <FForm.Field name="name">{TextInput}</FForm.Field>
                  <FForm.Field name="benefitIds">
                    {CosmeticBenefitMultipleSelect}
                  </FForm.Field>
                </Form.Content>
              </Dialog.Content>

              <Dialog.Footer>
                <Form.Footer>
                  {({ disabled }) => (
                    <Button disabled={disabled} type="submit">
                      {ingredient ? 'Редактировать' : 'Добавить'}
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
