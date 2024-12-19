import { DateUtils } from '#/shared/models/date';
import dayjs from '#shared/libs/dayjs';
import { useListStatisticsQuery } from '#ui/entities/statistics';

const startDate = DateUtils.toDateFormat(dayjs(new Date()).subtract(2, 'month'));
const endDate = DateUtils.toDateFormat(new Date());

export default function Page() {
  const { data } = useListStatisticsQuery({ startDate, endDate });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <thead>
        <th>Дата</th>
        <th>Вес</th>
        <th>Калории</th>
        <th>Белки</th>
        <th>Жиры</th>
        <th>Углеводы</th>
        <th>Клетчатка</th>
      </thead>
      <tbody>
        {data.map(item => {
          return (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>{item.body.weight || ''}</td>
              <td>{item.food.nutrients?.calories || ''}</td>
              <td>{item.food.nutrients?.proteins || ''}</td>
              <td>{item.food.nutrients?.fats || ''}</td>
              <td>{item.food.nutrients?.carbs || ''}</td>
              <td>{item.food.nutrients?.fibers || ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
