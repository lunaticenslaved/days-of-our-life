import dayjs from '#shared/libs/dayjs';
import { fromDateFormat, toDateFormat } from '#shared/models/common';
import { FoodTrackerMealItem, sumNutrients } from '#shared/models/food';
import { useListFoodRecipesQuery } from '#ui/api/food';
import { Button } from '#ui/components/Button';
import { Dialog, useDialog } from '#ui/components/Dialog';
import { FoodNutrientsList } from '#ui/entities/food-nutrients';
import { useListFoodProductsQuery } from '#ui/entities/food-product';
import {
  MealItemForm,
  useDeleteFoodTrackerMealItemMutation,
  useGetFoodTrackerDayQuery,
  useUpdateFoodTrackerMealItemMutation,
} from '#ui/entities/food-tracker';
import { useCreateFoodTrackerMealItemMutation } from '#ui/entities/food-tracker';
import { DAYS_NAVIGATION, useDaysPageParams } from '#ui/pages/days';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Page() {
  const params = useDaysPageParams();

  const date = useMemo(
    () => (params.date ? params.date : toDateFormat(new Date())),
    [params.date],
  );

  const mealItemDialog = useDialog();
  const productsQuery = useListFoodProductsQuery();
  const recipesQuery = useListFoodRecipesQuery();
  const trackerDayQuery = useGetFoodTrackerDayQuery(date);
  const adding = useCreateFoodTrackerMealItemMutation({
    onSuccess: () => {
      trackerDayQuery.refetch();
      mealItemDialog.close();
    },
  });
  const updating = useUpdateFoodTrackerMealItemMutation('', {
    onSuccess: () => {
      trackerDayQuery.refetch();
      mealItemDialog.close();
    },
  });
  const deleting = useDeleteFoodTrackerMealItemMutation('', {
    onSuccess: () => {
      trackerDayQuery.refetch();
    },
  });

  const [itemToEdit, setItemToEdit] = useState<FoodTrackerMealItem>();

  useEffect(() => {
    if (!mealItemDialog.isOpen) {
      setItemToEdit(undefined);
    }
  }, [mealItemDialog.isOpen]);

  const secondDialog = useDialog();

  const navigate = useNavigate();

  function setDate(newDate: Date | null) {
    if (newDate) {
      navigate(DAYS_NAVIGATION.toDate({ date: toDateFormat(newDate) }));
    }
  }

  return (
    <div>
      <input
        type="date"
        value={dayjs(fromDateFormat(date)).format('YYYY-M-D')}
        onChange={e => setDate(e.target.valueAsDate)}
      />
      <Button onClick={mealItemDialog.open}>Добавить еду</Button>

      <ul>
        {(trackerDayQuery.data?.meals || []).map(({ items }, index) => {
          return (
            <li key={index}>
              <div>Прием пищи 1</div>
              <FoodNutrientsList nutrients={sumNutrients(items.map(i => i.nutrients))} />
              <hr />
              <ul>
                {items.map(item => {
                  return (
                    <li key={item.id}>
                      <Button
                        onClick={() => {
                          setItemToEdit(item);
                          mealItemDialog.open();
                        }}>
                        Редактировать
                      </Button>

                      <Button
                        onClick={() => {
                          deleting.mutate({ itemId: item.id, date });
                        }}>
                        Удалить
                      </Button>

                      {item.ingredient.type === 'product' && (
                        <div>{item.ingredient.product.name}</div>
                      )}
                      {item.ingredient.type === 'recipe' && (
                        <div>{item.ingredient.recipe.name}</div>
                      )}
                      <div>
                        <span>{item.quantity}</span>
                        <span>-</span>
                        <span>{item.quantityConverter.name}</span>
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
        dialog={secondDialog}
        title="Dialog"
        body={
          <div>
            <button onClick={secondDialog.close}>Close</button>
          </div>
        }
      />

      <Dialog
        dialog={mealItemDialog}
        title={'Новая еда'}
        body={
          <>
            <button onClick={secondDialog.open}>Open</button>

            <MealItemForm
              mealItem={itemToEdit}
              products={productsQuery.data || []}
              recipes={recipesQuery.data || []}
              onSubmit={values => {
                if (itemToEdit) {
                  updating.mutate({
                    date,
                    itemId: itemToEdit.id,
                    quantity: values.quantity,
                    quantityConverterId: values.quantityConverterId,
                    ingredient: {
                      type: values.source,
                      id: values.sourceItemId,
                    },
                  });
                } else {
                  adding.mutate({
                    date,
                    quantity: values.quantity,
                    quantityConverterId: values.quantityConverterId,
                    ingredient: {
                      type: values.source,
                      id: values.sourceItemId,
                    },
                  });
                }
              }}
            />
          </>
        }
      />
    </div>
  );
}