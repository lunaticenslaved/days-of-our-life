import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayInfo, DayPart } from '#/shared/models/day';
import { AddWeightAction } from '#/client/entities/body-statistics';
import { FoodNutrientsList } from '#/client/entities/food';
import { Fragment, useMemo } from 'react';
import { StartFemalePeriodAction } from '#/client/entities/female-period';
import {
  CosmeticProductApplicationCreatingAction,
  CosmeticProductApplicationsList,
} from '#/client/entities/cosmetic/product-applications';
import {
  MedicamentIntakeCreatingAction,
  MedicamentIntakesList,
} from '#/client/entities/medicaments/medicament-intakes';

interface RenderDayPartProps {
  dayPart: DayPart;
  date: DateFormat;
}

interface CalendarProps {
  startDate: DateFormat;
  endDate: DateFormat;
  dayParts: DayPart[];
  getDayInfo(date: DateFormat): DayInfo | undefined;
  onUpdated(): void;
}

export function Calendar({
  dayParts,
  startDate,
  endDate,
  getDayInfo,
  onUpdated,
}: CalendarProps) {
  const dates = useMemo((): DateFormat[] => {
    return DateUtils.toArray({ start: startDate, end: endDate });
  }, [endDate, startDate]);

  function renderMedicamentIntakes(arg: RenderDayPartProps) {
    const intakes =
      getDayInfo(arg.date)?.medicamentIntakes?.filter(
        intake => intake.dayPartId === arg.dayPart.id,
      ) || [];

    return (
      <>
        <MedicamentIntakesList intakes={intakes} />
        <MedicamentIntakeCreatingAction date={arg.date} dayPartId={arg.dayPart.id} />
      </>
    );
  }

  function renderCosmeticProducts(arg: RenderDayPartProps) {
    const items =
      getDayInfo(arg.date)?.cosmeticProductApplications.filter(
        intake => intake.dayPartId === arg.dayPart.id,
      ) || [];

    return (
      <>
        <CosmeticProductApplicationsList applications={items} />
        <CosmeticProductApplicationCreatingAction
          date={arg.date}
          dayPartId={arg.dayPart.id}
        />
      </>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Цикл</th>
          <th>Вес</th>
          <th>Нутриенты</th>
          <th>Части дня</th>
          <th>Медикаменты</th>
          <th>Косметика</th>
        </tr>
      </thead>
      <tbody>
        {dates.map((date, index) => {
          const dayInfo = getDayInfo(date);

          const weight = dayInfo?.weight;
          const nutrients = dayInfo?.food.nutrients;
          const firstDayPart: DayPart | undefined = dayParts[0];

          return (
            <Fragment key={date}>
              <tr style={{ backgroundColor: index % 2 === 0 ? 'lightgrey' : '' }}>
                <td rowSpan={dayParts.length || 1}>
                  {DateUtils.isSame(date, new Date()) ? <strong>{date}</strong> : date}
                </td>
                <td rowSpan={dayParts.length || 1}>
                  {!!dayInfo && (
                    <StartFemalePeriodAction
                      femalePeriod={dayInfo.femalePeriod}
                      date={date}
                    />
                  )}
                </td>
                <td rowSpan={dayParts.length || 1}>
                  <AddWeightAction
                    date={date}
                    weight={weight || undefined}
                    onUpdated={onUpdated}
                  />
                </td>
                <td rowSpan={dayParts.length || 1}>
                  <FoodNutrientsList nutrients={nutrients || undefined} />
                </td>

                {firstDayPart && (
                  <>
                    <td>{firstDayPart.name}</td>
                    <td>
                      {renderMedicamentIntakes({
                        date,
                        dayPart: firstDayPart,
                      })}
                    </td>
                    <td>
                      {renderCosmeticProducts({
                        date,
                        dayPart: firstDayPart,
                      })}
                    </td>
                  </>
                )}
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
                    <td>
                      {renderCosmeticProducts({
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
