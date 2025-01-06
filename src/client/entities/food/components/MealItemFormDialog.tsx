import { CommonValidators } from '#/shared/models/common';
import {
  FoodProduct,
  FoodQuantityConverter,
  FoodRecipe,
  FoodMealItem,
  FoodValidators,
  multiplyNutrients,
} from '#/shared/models/food';
import { Button } from '#/client/components/Button';
import { Dialog, IUseDialog } from '#/client/components/Dialog';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { NumberInput } from '#/client/components/NumberInput';
import { Radio } from '#/client/components/Radio';
import { Select } from '#/client/components/Select';
import {
  FoodRecipeSearch,
  FoodProductSearch,
  FoodNutrientsList,
} from '#/client/entities/food';
import { z } from 'zod';

const schema = z.object({
  quantity: FoodValidators.quantity,
  quantityConverterId: FoodValidators.quantityConverterId,
  sourceItemId: CommonValidators.id,
  source: FoodValidators.mealItemSource,
});

type MealItemFormValues = z.infer<typeof schema>;

interface MealItemFormDialogProps {
  dialog: IUseDialog;
  onSubmit(values: MealItemFormValues): void;
  products: FoodProduct[];
  recipes: FoodRecipe[];
  mealItem?: FoodMealItem;
}

export function MealItemFormDialog({
  onSubmit,
  products,
  recipes,
  mealItem,
  dialog,
}: MealItemFormDialogProps) {
  return (
    <Dialog dialog={dialog}>
      <FForm
        schema={schema}
        onSubmit={v => onSubmit(v)}
        initialValues={{
          quantityConverterId: mealItem?.quantityConverter.id,
          source: mealItem?.ingredient.type ?? 'product',
          sourceItemId:
            mealItem?.ingredient.type === 'product'
              ? mealItem.ingredient.product.id
              : mealItem?.ingredient.type === 'recipe'
              ? mealItem.ingredient.recipe.id
              : undefined,
          quantity: mealItem?.quantity,
        }}>
        {({ values }) => {
          const product = products.find(
            p => values.source === 'product' && p.id === values.sourceItemId,
          );
          const recipe = recipes.find(
            p => values.source === 'recipe' && p.id === values.sourceItemId,
          );
          const quantities: FoodQuantityConverter[] = [
            ...(product?.quantities || []),
            ...(recipe?.quantities || []),
          ];
          const quantityConverter = quantities.find(
            q => q.id === values.quantityConverterId,
          );

          return (
            <>
              <Dialog.Header>Добавление еды</Dialog.Header>

              <Dialog.Content>
                <Form.Content>
                  <FForm.Field name="source">
                    {inputProps => (
                      <Radio.Group {...inputProps}>
                        <Radio value="product" title="Продукт" />
                        <Radio value="recipe" title="Рецепт" />
                      </Radio.Group>
                    )}
                  </FForm.Field>

                  {values.source === 'product' ? (
                    <FForm.Field name="sourceItemId" title="Продукт" required>
                      {inputProps => <FoodProductSearch {...inputProps} />}
                    </FForm.Field>
                  ) : (
                    <FForm.Field name="sourceItemId" title="Рецепт" required>
                      {inputProps => <FoodRecipeSearch {...inputProps} />}
                    </FForm.Field>
                  )}

                  <FForm.Field name="quantityConverterId">
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
                  </FForm.Field>

                  {quantityConverter && (
                    <FForm.Field title={quantityConverter.name} name="quantity" required>
                      {NumberInput}
                    </FForm.Field>
                  )}

                  {product && quantityConverter && values.quantity && (
                    <FoodNutrientsList
                      nutrients={multiplyNutrients(
                        product.nutrientsPerGram,
                        quantityConverter.grams * values.quantity,
                      )}
                    />
                  )}

                  {recipe && quantityConverter && values.quantity && (
                    <FoodNutrientsList
                      nutrients={multiplyNutrients(
                        recipe.nutrientsPerGram,
                        quantityConverter.grams * values.quantity,
                      )}
                    />
                  )}
                </Form.Content>
              </Dialog.Content>

              <Dialog.Footer>
                <Form.Footer>
                  {({ disabled }) => {
                    return (
                      <Button disabled={disabled} type="submit">
                        Добавить еду
                      </Button>
                    );
                  }}
                </Form.Footer>
              </Dialog.Footer>
            </>
          );
        }}
      </FForm>
    </Dialog>
  );
}
