import { Button } from '#ui/components/Button';
import { Dialog, useDialog } from '#ui/components/Dialog';
import { FoodNutrientsList } from '#ui/entities/food-nutrients';
import { useListFoodProductsQuery } from '#ui/entities/food-product';
import { MealIngredientForm, useGetFoodTrackerDayQuery } from '#ui/entities/food-tracker';
import { useAddFoodTrackerMealIngredientMutation } from '#ui/entities/food-tracker';

export default function Page() {
  const date = new Date().toISOString();

  const newFoodDialog = useDialog();
  const productsQuery = useListFoodProductsQuery();
  const trackerDayQuery = useGetFoodTrackerDayQuery(date);
  const adding = useAddFoodTrackerMealIngredientMutation({
    onSuccess: trackerDayQuery.refetch,
  });

  return (
    <div>
      <Button onClick={newFoodDialog.open}>Добавить еду</Button>

      <ul>
        {(trackerDayQuery.data?.meals || []).map(({ items }, index) => {
          return (
            <li key={index}>
              <div>Прием пищи 1</div>
              <ul>
                {items.map(item => {
                  return (
                    <li key={item.id}>
                      {item.source.type === 'product' && (
                        <div>{item.source.product.name}</div>
                      )}
                      {item.source.type === 'recipe' && (
                        <div>{item.source.recipe.name}</div>
                      )}
                      <div>
                        <span>{item.quantity}</span>
                        <span>-</span>
                        <span>{item.quantityType}</span>
                      </div>
                      <div>
                        <FoodNutrientsList nutrients={item.nutrients} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <Dialog
        isOpen={newFoodDialog.isOpen}
        onClose={newFoodDialog.close}
        title={'Новая еда'}
        body={
          <MealIngredientForm
            products={productsQuery.data || []}
            onSubmit={values => {
              adding.mutate({
                date,
                quantity: values.quantity,
                quantityType: values.quantityType,
                ingredient: {
                  type: 'product',
                  productId: values.productId,
                },
              });
            }}
          />
        }
      />
    </div>
  );
}
