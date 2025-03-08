import { ComponentProps } from 'react';
import { ActionsComponent } from '../components/Actions';
import { assertDefined, nonReachable } from '#/shared/utils';
import {
  useDeleteFoodMealItem,
  useListFoodProductsQuery,
  useListFoodRecipesQuery,
  useUpdateFoodMealItem,
} from '#/client/store/food';
import { FoodMealItemFormDialog as FormDialogComponent } from '../components/FormDialog';
import { findNutrients } from '#/client/entities/food/meal-items/utils';
import { useDialog } from '#/ui-lib/atoms/Dialog';

type ActionsComponentProps = ComponentProps<typeof ActionsComponent>;

type ActionsContainerProps = Pick<ActionsComponentProps, 'entity'>;

export function ActionsContainer({ entity, ...props }: ActionsContainerProps) {
  const editingDialog = useDialog();

  const deletingMutation = useDeleteFoodMealItem();
  const updatingMutation = useUpdateFoodMealItem();

  const listProducts = useListFoodProductsQuery();
  const listRecipes = useListFoodRecipesQuery();

  const products = listProducts.data || [];
  const recipes = listRecipes.data || [];

  const updateMealItem = useUpdateFoodMealItem({
    onMutate: editingDialog.close,
  });

  return (
    <>
      {editingDialog.isOpen && (
        <FormDialogComponent
          dialog={editingDialog}
          isPending={updateMealItem.isPending}
          entity={entity}
          onSubmit={values => {
            const nutrients = findNutrients(values, { products, recipes });

            assertDefined(nutrients);

            updateMealItem.mutate({
              oldItem: entity,
              newValues: {
                nutrients,
                date: entity.date,
                dayPartId: entity.dayPartId,
                quantity: values.quantity,
                food: values.food,
              },
            });
          }}
          products={products}
          recipes={recipes}
        />
      )}

      <ActionsComponent
        {...props}
        disabled={{
          delete: deletingMutation.isPending,
          edit: updatingMutation.isPending,
        }}
        entity={entity}
        onAction={(action, mealItem) => {
          if (action === 'delete') {
            deletingMutation.mutate(mealItem);
          } else if (action === 'edit') {
            editingDialog.open();
          } else {
            nonReachable(action);
          }
        }}
      />
    </>
  );
}
