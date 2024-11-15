import { CommonValidators } from '#shared/models/common';
import {
  FoodProduct,
  FoodRecipe,
  FoodTrackerMealItem,
  FoodValidators,
} from '#shared/models/food';
import { FFNumberInput } from '#ui/components/forms/FFNumberInput';
import { FForm } from '#ui/components/forms/FForm';
import { FFRadioGroup } from '#ui/components/forms/FFRadioGroup';
import { FFSelect } from '#ui/components/forms/FFSelect';
import { FoodNutrientsList } from '#ui/entities/food-nutrients';
import { z } from 'zod';

const schema = z.object({
  quantity: FoodValidators.quantity,
  quantityType: FoodValidators.quantityType.default('gram'),
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
        quantityType: 'gram',
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

        return (
          <>
            <FFRadioGroup
              name="source"
              options={[
                { title: 'Product', value: 'product' },
                { title: 'Recipe', value: 'recipe' },
              ]}
            />

            {values.source === 'product' ? (
              <FFSelect
                title="Продукт"
                name="sourceItemId"
                items={products}
                getTitle={p => p.name}
                getValue={p => p.id}
                required
              />
            ) : (
              <FFSelect
                title="Рецепт"
                name="sourceItemId"
                items={recipes}
                getTitle={p => p.name}
                getValue={p => p.id}
                required
              />
            )}
            <FFNumberInput title="Граммы" name="quantity" required />

            {product && values.quantity && (
              <FoodNutrientsList
                nutrients={product.nutrientsPerGram}
                multiplier={values.quantity}
              />
            )}

            {recipe && values.quantity && (
              <FoodNutrientsList
                nutrients={recipe.nutrientsPerGram}
                multiplier={values.quantity}
              />
            )}
          </>
        );
      }}
    </FForm>
  );
}
