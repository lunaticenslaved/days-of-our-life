import { createEntityFormDialog } from '#/client/component-factories/EntityFormDialog';
import { FinalForm } from '#/client/components/FForm';
import { NumberInput } from '#/client/components/NumberInput';
import { RadioGroup } from '#/client/components/Radio';
import { Select } from '#/client/components/Select';
import {
  FoodNutrientsList,
  FoodProductSearch,
  FoodRecipeSearch,
} from '#/client/entities/food';
import { getNutrientsPerGram } from '../utils';
import { CommonValidators } from '#/shared/models/common';
import {
  FoodMealItem,
  FoodProduct,
  FoodRecipe,
  FoodValidators,
  multiplyNutrients,
} from '#/shared/models/food';
import { cloneDeep } from 'lodash';
import { ComponentProps } from 'react';
import { z } from 'zod';
import { undefinedOnError } from '#/shared/utils';

const schema = z.object({
  quantity: FoodValidators.quantity,
  quantityConverterId: FoodValidators.quantityConverterId,
  food: z
    .object({
      type: z.literal('product'),
      productId: CommonValidators.id,
    })
    .or(
      z.object({
        type: z.literal('recipe'),
        recipeId: CommonValidators.id,
      }),
    ),
});

type AdditionalProps = {
  products: FoodProduct[];
  recipes: FoodRecipe[];
};

type FormValues = z.infer<typeof schema>;

export type FoodMealItemFormDialogProps = ComponentProps<typeof FoodMealItemFormDialog>;

export const FoodMealItemFormDialog = createEntityFormDialog<
  FoodMealItem,
  typeof schema,
  AdditionalProps
>({
  schema,
  titleText: {
    create: 'Добавление еды',
    update: 'Редактирование еды',
  },
  submitText: {
    create: 'Добавить',
    update: 'Редактировать',
  },
  renderFields({ values }, { products, recipes }) {
    const { food } = values;
    const quantities =
      food.type === 'product'
        ? products.find(product => product.id === food.productId)?.quantities || []
        : food.type === 'recipe'
        ? recipes.find(recipe => recipe.id === food.recipeId)?.quantities || []
        : [];
    const quantityConverter = quantities.find(q => q.id === values.quantityConverterId);

    const nutrientsPerGram = undefinedOnError(getNutrientsPerGram)(
      { food },
      {
        recipes,
        products,
      },
    );

    console.log(values);

    return (
      <>
        <FinalForm.Field name="food.type">
          {inputProps => (
            <RadioGroup {...inputProps}>
              <RadioGroup.Button value="product" title="Продукт" />
              <RadioGroup.Button value="recipe" title="Рецепт" />
            </RadioGroup>
          )}
        </FinalForm.Field>

        {food.type === 'product' ? (
          <FinalForm.Field name="food.productId" title="Продукт" required>
            {inputProps => <FoodProductSearch {...inputProps} />}
          </FinalForm.Field>
        ) : (
          <FinalForm.Field name="food.recipeId" title="Рецепт" required>
            {inputProps => <FoodRecipeSearch {...inputProps} />}
          </FinalForm.Field>
        )}

        <FinalForm.Field name="quantityConverterId" title="Количество">
          {inputProps => (
            <Select {...inputProps}>
              {quantities.map(quantity => {
                return (
                  <Select.Option key={quantity.id} value={quantity.id}>
                    {quantity.name}
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </FinalForm.Field>

        {quantityConverter && (
          <FinalForm.Field title={quantityConverter.name} name="quantity" required>
            {NumberInput}
          </FinalForm.Field>
        )}

        {nutrientsPerGram && quantityConverter && values.quantity && (
          <FoodNutrientsList
            nutrients={multiplyNutrients(
              nutrientsPerGram,
              quantityConverter.grams * values.quantity,
            )}
          />
        )}
      </>
    );
  },
  getInitialValues(mealItem) {
    let food: FormValues['food'];

    if (mealItem) {
      food = cloneDeep(mealItem.food);
    } else {
      food = {
        type: 'product',
        productId: '',
      };
    }

    return {
      food,
      quantityConverterId: mealItem?.quantity.converterId || '',
      quantity: mealItem?.quantity.value || 100,
    };
  },
});
