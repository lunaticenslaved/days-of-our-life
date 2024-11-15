import { CommonValidators } from '#shared/models/common';
import {
  FoodProduct,
  FoodQuantityConverter,
  FoodRecipe,
  FoodTrackerMealItem,
  FoodValidators,
  multiplyNutrients,
} from '#shared/models/food';
import { FForm } from '#ui/components/FForm';
import { NumberInput } from '#ui/components/NumberInput';
import { Radio } from '#ui/components/Radio';
import { Select } from '#ui/components/Select';
import { FoodNutrientsList } from '#ui/entities/food-nutrients';
import { FoodProductSelect } from '#ui/entities/food-product';
import { FoodRecipeSelect } from '#ui/entities/food-recipe';
import { z } from 'zod';

const schema = z.object({
  quantity: FoodValidators.quantity,
  quantityConverterId: FoodValidators.quantityConverterId,
  sourceItemId: CommonValidators.id,
  source: FoodValidators.mealItemSource,
});

type MealItemFormValues = z.infer<typeof schema>;

interface MealItemFormProps {
  onSubmit(values: MealItemFormValues): void;
  products: FoodProduct[];
  recipes: FoodRecipe[];
  mealItem?: FoodTrackerMealItem;
}

export function MealItemForm({
  onSubmit,
  products,
  recipes,
  mealItem,
}: MealItemFormProps) {
  return (
    <FForm
      schema={schema}
      onSubmit={v => onSubmit(v)}
      initialValues={{
        quantityConverterId: 'grams',
        source: mealItem?.source.type ?? 'product',
        sourceItemId:
          mealItem?.source.type === 'product'
            ? mealItem.source.product.id
            : mealItem?.source.type === 'recipe'
            ? mealItem.source.recipe.id
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
                {inputProps => <FoodProductSelect {...inputProps} products={products} />}
              </FForm.Field>
            ) : (
              <FForm.Field name="sourceItemId" title="Рецепт" required>
                {inputProps => <FoodRecipeSelect {...inputProps} recipes={recipes} />}
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
              <FForm.Field
                title={quantityConverter.name}
                name="quantity"
                converter="number"
                required>
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
          </>
        );
      }}
    </FForm>
  );
}
