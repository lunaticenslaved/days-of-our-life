import {
  CosmeticINCIIngredient,
  CosmeticINCIIngredientValidators,
} from '#/shared/models/cosmetic';
import { TextInput } from '#/client/components/TextInput';
import { FinalForm } from '#/client/components/FForm';
import { z } from 'zod';
import { CosmeticBenefitMultipleSelect } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitSelect';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';

const schema = z.object({
  name: CosmeticINCIIngredientValidators.name,
  benefitIds: CosmeticINCIIngredientValidators.benefitIds,
});

export const CosmeticINCIIngredientFormDialog = createEntityFormDialog<
  CosmeticINCIIngredient,
  typeof schema
>({
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
          {TextInput}
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
