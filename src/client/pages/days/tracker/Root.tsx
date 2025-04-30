import { FoodMealItemsList, FoodNutrientsList } from '#/client/entities/food';
import { useState } from 'react';
import { DatePicker } from '#/ui-lib/components/atoms/DatePicker';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { useGetDayQuery, useListFoodMealItemQuery } from '#/client/store';
import { sumNutrients } from '#/shared/models/food';
import { useSearchParams } from 'react-router-dom';

const DATE_SEARCH_PARAM = 'date';

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, _setDate] = useState<DateFormat>(() => {
    // FIXME validate search param
    return (
      (searchParams.get(DATE_SEARCH_PARAM) as DateFormat) ||
      DateUtils.toDateFormat(new Date())
    );
  });

  const setDate = (newDate?: DateFormat) => {
    const requiredNewDate = newDate || DateUtils.toDateFormat(new Date());

    _setDate(requiredNewDate);

    const newSearchParams = new URLSearchParams();

    if (newDate !== DateUtils.toDateFormat(new Date())) {
      newSearchParams.set(DATE_SEARCH_PARAM, requiredNewDate);
    }

    setSearchParams(newSearchParams);
  };

  const dayQuery = useGetDayQuery(date);
  const listMealItemsQuery = useListFoodMealItemQuery(date);

  if (!dayQuery.data || !listMealItemsQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DatePicker
        type="single"
        value={date}
        onValueUpdate={v => setDate(v ? v : DateUtils.toDateFormat(new Date()))}
      />

      <section>
        <h2>Еда</h2>

        <FoodNutrientsList
          nutrients={sumNutrients(listMealItemsQuery.data.map(item => item.nutrients))}
        />

        <FoodMealItemsList date={date} />
      </section>
    </div>
  );
}
