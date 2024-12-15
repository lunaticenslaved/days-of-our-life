import {
  dateDiff,
  fromDateFormat,
  isSameDate,
  toDateFormat,
} from '#shared/models/common';
import { FoodTrackerMealItem, sumNutrients } from '#shared/models/food';
import { Button } from '#ui/components/Button';
import { useDialog } from '#ui/components/Dialog';
import {
  BodyWeightFormDialog,
  usePostBodyWeightMutation,
} from '#ui/entities/body-statistics';
import {
  MealItemFormDialog,
  FoodNutrientsList,
  useListFoodRecipesQuery,
  useListFoodProductsQuery,
} from '#ui/entities/food';
import {
  useDeleteFoodTrackerMealItemMutation,
  useGetFoodTrackerDayQuery,
  useUpdateFoodTrackerMealItemMutation,
  useCreateFoodTrackerMealItemMutation,
} from '#ui/entities/food';
import { DAYS_NAVIGATION, useDaysPageParams } from '#ui/pages/days';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DatePicker } from '#ui/components/DatePicker';
import { useGetStatisticsQuery } from '#ui/entities/statistics';
import {
  StartFemalePeriodButton,
  useStartFemalePeriodMutation,
} from '#ui/entities/female-period';

export default function Page() {
  const params = useDaysPageParams();
  const [date, setDate] = useState(() => {
    return params.date ? fromDateFormat(params.date) : new Date();
  });

  const dateStatistics = useGetStatisticsQuery({ date: toDateFormat(date) });
  const formattedDate = toDateFormat(date);

  const navigate = useNavigate();
  useEffect(() => {
    navigate(DAYS_NAVIGATION.toDate({ date: toDateFormat(date) }));
  }, [date, navigate]);

  const mealItemDialog = useDialog();
  const productsQuery = useListFoodProductsQuery();
  const recipesQuery = useListFoodRecipesQuery();
  const trackerDayQuery = useGetFoodTrackerDayQuery(formattedDate);
  const adding = useCreateFoodTrackerMealItemMutation({
    onSuccess: () => {
      trackerDayQuery.refetch();
      mealItemDialog.close();
    },
  });
  const updating = useUpdateFoodTrackerMealItemMutation({
    onSuccess: () => {
      trackerDayQuery.refetch();
      mealItemDialog.close();
    },
  });
  const deleting = useDeleteFoodTrackerMealItemMutation({
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

  const weightDialog = useDialog();

  const savingWeight = usePostBodyWeightMutation({
    onSuccess: () => {
      weightDialog.close();
      dateStatistics.refetch();
    },
  });

  const startFemalePeriod = useStartFemalePeriodMutation({
    onSuccess: dateStatistics.refetch,
  });

  if (!dateStatistics.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DatePicker modelValue={date} onModelValueChange={v => setDate(v || new Date())} />

      <section>
        <h2>Вес</h2>
        <div>
          <div style={{ display: 'flex' }}>
            <div>{dateStatistics.data.body?.weight}</div>
            <Button onClick={weightDialog.open}>Редактировать вес</Button>
          </div>

          <BodyWeightFormDialog
            dialog={weightDialog}
            disabled={savingWeight.isPending}
            weight={dateStatistics.data.body?.weight}
            onSubmit={({ weight }) => {
              savingWeight.mutate({ date: formattedDate, weight });
            }}
          />
        </div>
      </section>

      <section>
        <h2>Цикл</h2>
        <div>
          {dateStatistics.data.period ? (
            isSameDate(dateStatistics.data.period.startDate, toDateFormat(date)) ? (
              <div>Первый день</div>
            ) : (
              <div>
                <div>
                  {dateDiff(new Date(), dateStatistics.data.period.startDate, 'days')}
                </div>
                <div>
                  <StartFemalePeriodButton
                    onStartPeriod={() =>
                      startFemalePeriod.mutate({ startDate: toDateFormat(date) })
                    }
                  />
                </div>
              </div>
            )
          ) : (
            <StartFemalePeriodButton
              onStartPeriod={() =>
                startFemalePeriod.mutate({ startDate: toDateFormat(date) })
              }
            />
          )}
        </div>
      </section>

      <section>
        <h2>Еда</h2>

        <Button onClick={mealItemDialog.open}>Добавить еду</Button>

        <ul>
          {(trackerDayQuery.data?.meals || []).map(({ items }, index) => {
            return (
              <li key={index}>
                <div>Прием пищи 1</div>
                <FoodNutrientsList
                  nutrients={sumNutrients(items.map(i => i.nutrients))}
                />
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
                            deleting.mutate({
                              itemId: item.id,
                              date: formattedDate,
                            });
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

        <MealItemFormDialog
          dialog={mealItemDialog}
          mealItem={itemToEdit}
          products={productsQuery.data || []}
          recipes={recipesQuery.data || []}
          onSubmit={values => {
            if (itemToEdit) {
              updating.mutate({
                date: formattedDate,
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
                date: formattedDate,
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
      </section>
    </div>
  );
}
