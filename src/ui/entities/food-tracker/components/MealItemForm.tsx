import { CommonValidators } from '#shared/models/common';
import { FoodProduct, FoodTrackerMealItem, FoodValidators } from '#shared/models/food';
import { FFNumberInput } from '#ui/components/forms/FFNumberInput';
import { FForm } from '#ui/components/forms/FForm';
import { FFSelect } from '#ui/components/forms/FFSelect';
import { FoodNutrientsList } from '#ui/entities/food-nutrients';
import { z } from 'zod';

const schema = z.object({
  productId: CommonValidators.id,
  quantity: FoodValidators.quantity,
  quantityType: FoodValidators.quantityType.default('gram'),
});

type MealItemFormValues = z.infer<typeof schema>;

interface MealItemFormProps {
  onSubmit(values: MealItemFormValues): void;
  products: FoodProduct[];
  mealItem?: FoodTrackerMealItem;
}

export function MealItemForm({ onSubmit, products, mealItem }: MealItemFormProps) {
  return (
    <FForm
      schema={schema}
      onSubmit={v => onSubmit(v)}
      initialValues={{
        quantityType: 'gram',
        productId:
          mealItem?.source.type === 'product' ? mealItem.source.product.id : undefined,
        quantity: mealItem?.quantity,
      }}>
      {({ values }) => {
        const product = products.find(p => p.id === values.productId);

        return (
          <>
            <FFSelect
              title="Продукт"
              name="productId"
              items={products}
              getTitle={p => p.name}
              getValue={p => p.id}
              required
            />
            <FFNumberInput title="Граммы" name="quantity" required />

            {product && values.quantity && (
              <FoodNutrientsList
                nutrients={product.nutrientsPerGram}
                multiplier={values.quantity}
              />
            )}
          </>
        );
      }}
    </FForm>
  );
}
