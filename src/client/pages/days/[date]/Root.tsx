import { FoodMealItemsList } from '#/client/entities/food';
import { DAYS_NAVIGATION, useDaysPageParams } from '#/client/pages/days';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DatePicker } from '#/client/components/DatePicker';
import { DateUtils } from '#/shared/models/date';
import { useGetDayQuery } from '#/client/store';

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

  const dayQuery = useGetDayQuery(formattedDate);

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
        <h2>Еда</h2>

        <FoodMealItemsList date={DateUtils.toDateFormat(date)} />
      </section>
    </div>
  );
}
