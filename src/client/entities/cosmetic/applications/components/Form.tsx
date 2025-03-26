import { z } from 'zod';
import { CommonValidators } from '#/shared/models/common';
import { CosmeticProductSingleSelect } from '#/client/entities/cosmetic/products';
import { CosmeticProduct, CosmeticRecipe } from '#/shared/models/cosmetic';
import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { DateFormat } from '#/shared/models/date';
import { FinalForm } from '#/client/components/FForm';
import { RadioGroup } from '#/client/components/Radio';
import { CosmeticRecipeSingleSelect } from '#/client/entities/cosmetic/recipes';
import { nonReachable } from '#/shared/utils';

// FIXME add better validation
const schema = z.union([
  z.object({
    type: z.literal('recipe'),
    recipeId: CommonValidators.id,
  }),
  z.object({
    type: z.literal('product'),
    productId: CommonValidators.id,
  }),
]);

export type FormValues = z.infer<typeof schema>;

export const FormDialogComponent = createEntityFormDialog<
  CosmeticApplication,
  typeof schema,
  {
    date: DateFormat;
    dayPartId: string;
    initialValues?: Partial<FormValues>;
    products: CosmeticProduct[];
    recipes: CosmeticRecipe[];
  }
>({
  schema,
  titleText: {
    create: 'Добавление косметики',
    update: 'Редактирование косметики',
  },
  submitText: {
    create: 'Добавить',
    update: 'Редактировать',
  },
  renderFields({ values }, { products, recipes }) {
    return (
      <>
        <FinalForm.Field name="type">
          {inputProps => (
            <RadioGroup {...inputProps}>
              <RadioGroup.Button value="product" title="Продукт" />
              <RadioGroup.Button value="recipe" title="Рецепт" />
            </RadioGroup>
          )}
        </FinalForm.Field>

        {values.type === 'product' ? (
          <FinalForm.Field name="productId" title="Продукт" required>
            {inputProps => (
              <CosmeticProductSingleSelect
                entities={products}
                value={inputProps.modelValue}
                onValueUpdate={inputProps.onModelValueChange}
              />
            )}
          </FinalForm.Field>
        ) : (
          <FinalForm.Field name="recipeId" title="Рецепт" required>
            {inputProps => (
              <CosmeticRecipeSingleSelect
                entities={recipes}
                value={inputProps.modelValue}
                onValueUpdate={inputProps.onModelValueChange}
              />
            )}
          </FinalForm.Field>
        )}
      </>
    );
  },
  getInitialValues(_entity, { initialValues }) {
    if (!initialValues?.type) {
      return {
        type: 'recipe',
        recipeId: '',
      };
    } else if (initialValues.type === 'product') {
      return {
        type: 'product',
        productId: initialValues.productId || '',
      };
    } else if (initialValues.type === 'recipe') {
      return {
        type: 'recipe',
        recipeId: initialValues.recipeId || '',
      };
    } else {
      nonReachable(initialValues.type);
    }
  },
});
