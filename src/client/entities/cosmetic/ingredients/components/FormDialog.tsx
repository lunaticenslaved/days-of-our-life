import {
  CosmeticIngredient,
  CosmeticIngredientValidators,
} from '#/shared/models/cosmetic';
import { TextInput } from '#/client/components/TextInput';
import { FinalForm } from '#/client/components/FForm';
import { z } from 'zod';
import { CosmeticBenefitMultipleSelect } from '#/client/entities/cosmetic/benefits/components/CosmeticBenefitSelect';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { TextArea } from '#/client/components/TextArea';
import { CosmeticINCIIngredientMultipleSelect } from '#/client/entities/cosmetic/inci-indgredients/containers/MultipleSelect';

const schema = z.object({
  name: CosmeticIngredientValidators.name,
  description: CosmeticIngredientValidators.description,
  INCIIngredientIds: CosmeticIngredientValidators.INCIIngredientIds,
  benefitIds: CosmeticIngredientValidators.benefitIds,
});

// FIXME use from field from atoms
export const CosmeticIngredientFormDialog = createEntityFormDialog<
  CosmeticIngredient,
  typeof schema
>({
  schema,
  titleText: {
    create: 'Добавление ингредиента',
    update: 'Редактирование ингредиента',
  },
  submitText: {
    create: 'Добавить',
    update: 'Редактировать',
  },
  renderFields() {
    return (
      <>
        <FinalForm.Field name="name" title="Название" required>
          {TextInput}
        </FinalForm.Field>

        <FinalForm.Field name="description" title="Описание">
          {TextArea}
        </FinalForm.Field>

        <FinalForm.Field name="INCIIngredientIds" title="INCI" required>
          {CosmeticINCIIngredientMultipleSelect}
        </FinalForm.Field>

        <FinalForm.Field name="benefitIds" title="Направления действия">
          {CosmeticBenefitMultipleSelect}
        </FinalForm.Field>
      </>
    );
  },
  getInitialValues(entity) {
    return {
      name: entity?.name || '',
      description: entity?.description || '',
      INCIIngredientIds: entity?.INCIIngredientIds || [],
      benefitIds: entity ? entity.benefitIds : [],
    };
  },
});
