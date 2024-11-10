import { CommonValidators } from '#shared/models/common';
import { FoodProduct, FoodValidators } from '#shared/models/food';
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

type MealIngredientFormValues = z.infer<typeof schema>;

interface MealIngredientFormProps {
  onSubmit(values: MealIngredientFormValues): void;
  products: FoodProduct[];
}

export function MealIngredientForm({ onSubmit, products }: MealIngredientFormProps) {
  return (
    <FForm
      schema={schema}
      onSubmit={v => onSubmit(v)}
      initialValues={{
        quantityType: 'gram',
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
