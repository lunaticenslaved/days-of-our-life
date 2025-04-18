import { Button } from '#/ui-lib/atoms/Button/Button';
import { findNutrients } from '#/client/entities/food/meal-items/utils';
import {
  useCreateFoodMealItem,
  useListFoodProductsQuery,
  useListFoodRecipesQuery,
} from '#/client/store';
import { DateFormat } from '#/shared/models/date';
import { assertDefined } from '#/shared/utils';
import { useDialog } from '#/ui-lib/atoms/Dialog';
import { FoodMealItemFormDialog as FormDialogComponent } from '../components/FormDialog';

interface CreatingActionProps {
  date: DateFormat;
  dayPartId: string;
}

export function CreatingAction({ date, dayPartId }: CreatingActionProps) {
  const mealItemDialog = useDialog();

  const creatingMutation = useCreateFoodMealItem();

  const listProducts = useListFoodProductsQuery();
  const listRecipes = useListFoodRecipesQuery();

  const products = listProducts.data || [];
  const recipes = listRecipes.data || [];

  const createMealItem = useCreateFoodMealItem({
    onMutate: mealItemDialog.close,
  });

  return (
    <>
      <FormDialogComponent
        dialog={mealItemDialog}
        isPending={createMealItem.isPending}
        onSubmit={values => {
          const nutrients = findNutrients(values, { products, recipes });

          assertDefined(nutrients);

          createMealItem.mutate({
            date,
            dayPartId,
            nutrients,
            quantity: values.quantity,
            food: values.food,
          });
        }}
        products={products}
        recipes={recipes}
      />

      <Button onClick={mealItemDialog.open} disabled={creatingMutation.isPending}>
        Добавить
      </Button>
    </>
  );
}
