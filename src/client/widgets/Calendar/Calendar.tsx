import dayjs from '#/shared/libs/dayjs';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayPart } from '#/shared/models/day';
import { FoodNutrients } from '#/shared/models/food';
import { Medicament, MedicamentIntake } from '#/shared/models/medicament';
import { Button } from '#/client/components/Button';
import { AddWeightAction } from '#/client/entities/body-statistics';
import { FoodNutrientsList } from '#/client/entities/food';
import {
  MedicamentIntakeActions,
  MedicamentIntakesList,
} from '#/client/entities/medicament/components';
import { Fragment, useMemo } from 'react';

interface RenderMedicamentIntakesProps {
  dayPart: DayPart;
  date: DateFormat;
}

interface RenderMedicamentIntakeActionsProps extends RenderMedicamentIntakesProps {
  intake: MedicamentIntake;
}

interface CalendarProps {
  startDate: DateFormat;
  endDate: DateFormat;
  medicaments: Medicament[];
  dayParts: DayPart[];
  getWeight(date: DateFormat): number | null | undefined;
  getNutrients(date: DateFormat): FoodNutrients | null | undefined;
  getMedicamentIntakes(date: DateFormat, dayPartId: string): MedicamentIntake[];
  onMedicamentIntakeDelete(arg: RenderMedicamentIntakeActionsProps): void;
  onAddMedicamentIntake(arg: RenderMedicamentIntakesProps): void;
  onUpdated(): void;
}

export function Calendar({
  dayParts,
  startDate,
  endDate,
  medicaments,
  getWeight,
  getNutrients,
  getMedicamentIntakes,
  onMedicamentIntakeDelete,
  onAddMedicamentIntake,
  onUpdated,
}: CalendarProps) {
  const dates = useMemo((): DateFormat[] => {
    const start = DateUtils.fromDateFormat(startDate);
    const end = DateUtils.fromDateFormat(endDate);

    const result: DateFormat[] = [];

    let date = dayjs(start);

    while (date.isBefore(end, 'day') || date.isSame(end, 'day')) {
      result.push(DateUtils.toDateFormat(date));
      date = date.add(1, 'day');
    }

    return result;
  }, [endDate, startDate]);

  function renderMedicamentIntakeActions(arg: RenderMedicamentIntakeActionsProps) {
    return <MedicamentIntakeActions onDelete={() => onMedicamentIntakeDelete(arg)} />;
  }

  function renderMedicamentIntakes(arg: RenderMedicamentIntakesProps) {
    return (
      <>
        <MedicamentIntakesList
          medicaments={medicaments}
          intakes={getMedicamentIntakes(arg.date, arg.dayPart.id)}
          renderActions={intake => {
            return renderMedicamentIntakeActions({ ...arg, intake });
          }}
        />
        <div style={{ marginTop: '10px' }}>
          <Button onClick={() => onAddMedicamentIntake(arg)}>Добавить медикамент</Button>
        </div>
      </>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Вес</th>
          <th>Нутриенты</th>
          <th>Части дня</th>
          <th>Медикаменты</th>
        </tr>
      </thead>
      <tbody>
        {dates.map((date, index) => {
          const weight = getWeight(date);
          const nutrients = getNutrients(date);
          const firstDayPart = dayParts[0];

          return (
            <Fragment key={date}>
              <tr style={{ backgroundColor: index % 2 === 0 ? 'lightgrey' : '' }}>
                <td rowSpan={dayParts.length}>
                  {DateUtils.isSame(date, new Date()) ? <strong>{date}</strong> : date}
                </td>
                <td rowSpan={dayParts.length}>
                  <AddWeightAction
                    date={date}
                    weight={weight || undefined}
                    onUpdated={onUpdated}
                  />
                </td>
                <td rowSpan={dayParts.length}>
                  <FoodNutrientsList nutrients={nutrients || undefined} />
                </td>
                <td>{firstDayPart.name}</td>
                <td>
                  {renderMedicamentIntakes({
                    date,
                    dayPart: firstDayPart,
                  })}
                </td>
              </tr>
              {dayParts.slice(1).map(dayPart => {
                return (
                  <tr
                    key={dayPart.id}
                    style={{ backgroundColor: index % 2 === 0 ? 'lightgrey' : '' }}>
                    <td>{dayPart.name}</td>
                    <td>
                      {renderMedicamentIntakes({
                        date,
                        dayPart,
                      })}
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
