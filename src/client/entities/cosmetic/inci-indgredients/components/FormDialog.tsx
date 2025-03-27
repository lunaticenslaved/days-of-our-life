import {
  CosmeticINCIIngredient,
  CosmeticINCIIngredientValidators,
} from '#/shared/models/cosmetic';
import { FinalForm } from '#/client/components/FForm';
import { z } from 'zod';
import { CosmeticBenefitMultipleSelect } from '#/client/entities/cosmetic/benefits/components/Select';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { TextInput } from '#/ui-lib/molecules/TextInputField';

const schema = z.object({
  name: CosmeticINCIIngredientValidators.name,
  benefitIds: CosmeticINCIIngredientValidators.benefitIds,
});

export const FormDialog = createEntityFormDialog<CosmeticINCIIngredient, typeof schema>({
  schema,
  titleText: {
    create: 'Добавление INCI ингредиента',
    update: 'Редактирование INCI ингредиента',
  },
  submitText: {
    create: 'Добавить',
    update: 'Редактировать',
  },
  renderFields() {
    return (
      <>
        <FinalForm.Field name="name" title="Название">
          {fieldProps => {
            return (
              <TextInput
                {...fieldProps}
                value={fieldProps.value}
                onValueUpdate={fieldProps.onModelValueChange}
              />
            );
          }}
        </FinalForm.Field>

        <FinalForm.Field name="benefitIds">
          {CosmeticBenefitMultipleSelect}
        </FinalForm.Field>
      </>
    );
  },
  getInitialValues(entity) {
    return {
      name: entity?.name || '',
      benefitIds: entity ? entity.benefitIds : [],
    };
  },
});
