import { CommonValidators } from '#shared/models/common';
import {
  FoodProduct,
  FoodQuantityConverter,
  FoodRecipe,
  FoodTrackerMealItem,
  FoodValidators,
  multiplyNutrients,
} from '#shared/models/food';
import { Button } from '#ui/components/Button';
import { Dialog, IUseDialog } from '#ui/components/Dialog';
import { FForm } from '#ui/components/FForm';
import { Form } from '#ui/components/Form';
import { NumberInput } from '#ui/components/NumberInput';
import { Radio } from '#ui/components/Radio';
import { Select } from '#ui/components/Select';
import {
  FoodRecipeSelect,
  FoodProductSelect,
  FoodNutrientsList,
} from '#ui/entities/food';
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
  mealItem?: FoodTrackerMealItem;
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
                      {inputProps => (
                        <FoodProductSelect {...inputProps} products={products} />
                      )}
                    </FForm.Field>
                  ) : (
                    <FForm.Field name="sourceItemId" title="Рецепт" required>
                      {inputProps => (
                        <FoodRecipeSelect {...inputProps} recipes={recipes} />
                      )}
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
