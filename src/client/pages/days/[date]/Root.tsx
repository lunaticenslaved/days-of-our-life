import { FoodMealItem, sumNutrients } from '#/shared/models/food';
import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import { AddWeightAction } from '#/client/entities/body-statistics';
import { MealItemFormDialog, FoodNutrientsList } from '#/client/entities/food';
import { DAYS_NAVIGATION, useDaysPageParams } from '#/client/pages/days';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DatePicker } from '#/client/components/DatePicker';
import { StartFemalePeriodButton } from '#/client/entities/female-period';
import { DateUtils } from '#/shared/models/date';
import {
  useAddFoodToDateMutation,
  useGetDayQuery,
  useStartFemalePeriodMutation,
  useUpdateFoodForDateMutation,
  useRemoveFoodFromDateMutation,
  useListFoodForDateQuery,
  useListFoodProductsQuery,
  useListFoodRecipesQuery,
} from '#/client/store';
import { groupBy } from 'lodash';

export default function Page() {
  const params = useDaysPageParams();
  const [date, setDate] = useState(() => {
    return params.date ? DateUtils.fromDateFormat(params.date) : new Date();
  });

  const formattedDate = DateUtils.toDateFormat(date);

  const navigate = useNavigate();
  useEffect(() => {
    navigate(DAYS_NAVIGATION.toDate({ date: DateUtils.toDateFormat(date) }));
  }, [date, navigate]);

  const mealItemDialog = useDialog();
  const dayQuery = useGetDayQuery(formattedDate);
  const productsQuery = useListFoodProductsQuery();
  const recipesQuery = useListFoodRecipesQuery();
  const listFoodForDateQuery = useListFoodForDateQuery(DateUtils.toDateFormat(date));
  const addFoodToDateMutation = useAddFoodToDateMutation({
    onSuccess: () => {
      listFoodForDateQuery.refetch();
      mealItemDialog.close();
    },
  });
  const updateFoodForDateMutation = useUpdateFoodForDateMutation({
    onSuccess: () => {
      listFoodForDateQuery.refetch();
      mealItemDialog.close();
    },
  });
  const removeFoodFromDateMutation = useRemoveFoodFromDateMutation({
    onSuccess: () => {
      listFoodForDateQuery.refetch();
    },
  });

  const [itemToEdit, setItemToEdit] = useState<FoodMealItem>();

  useEffect(() => {
    if (!mealItemDialog.isOpen) {
      setItemToEdit(undefined);
    }
  }, [mealItemDialog.isOpen]);

  const startFemalePeriod = useStartFemalePeriodMutation();

  if (!dayQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DatePicker
        type="single"
        modelValue={DateUtils.toDateFormat(date)}
        onModelValueChange={v => setDate(v ? DateUtils.fromDateFormat(v) : new Date())}
      />

      <section>
        <h2>Вес</h2>
        <div>
          <div style={{ display: 'flex' }}>
            <div>{dayQuery.data.weight}</div>
            <AddWeightAction
              date={DateUtils.toDateFormat(date)}
              onUpdated={() => {
                dayQuery.refetch();
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <h2>Цикл</h2>
        <div>
          {dayQuery.data.femalePeriod ? (
            DateUtils.isSame(
              dayQuery.data.femalePeriod.startDate,
              DateUtils.toDateFormat(date),
            ) ? (
              <div>Первый день</div>
            ) : (
              <div>
                <div>
                  {DateUtils.diff(
                    new Date(),
                    dayQuery.data.femalePeriod.startDate,
                    'days',
                  )}
                </div>
                <div>
                  <StartFemalePeriodButton
                    onStartPeriod={() =>
                      startFemalePeriod.mutate({
                        startDate: DateUtils.toDateFormat(date),
                      })
                    }
                  />
                </div>
              </div>
            )
          ) : (
            <StartFemalePeriodButton
              onStartPeriod={() =>
                startFemalePeriod.mutate({ startDate: DateUtils.toDateFormat(date) })
              }
            />
          )}
        </div>
      </section>

      <section>
        <h2>Еда</h2>

        <Button onClick={mealItemDialog.open}>Добавить еду</Button>

        <ul>
          {Object.values(
            groupBy(listFoodForDateQuery.data || [], item => item.dayPartId),
          ).map((items, index) => {
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
                            removeFoodFromDateMutation.mutate(item);
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
            // FIXME
            // if (itemToEdit) {
            //   updateFoodForDateMutation.mutate({
            //     date: formattedDate,
            //     itemId: itemToEdit.id,
            //     quantity: values.quantity,
            //     quantityConverterId: values.quantityConverterId,
            //     ingredient: {
            //       type: values.source,
            //       id: values.sourceItemId,
            //     },
            //   });
            // } else {
            //   addFoodToDateMutation.mutate({
            //     date: formattedDate,
            //     quantity: values.quantity,
            //     quantityConverterId: values.quantityConverterId,
            //     ingredient: {
            //       type: values.source,
            //       id: values.sourceItemId,
            //     },
            //   });
            // }
          }}
        />
      </section>
    </div>
  );
}
