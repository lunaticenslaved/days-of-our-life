import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayPart } from '#/shared/models/day';
import { Box } from '#/ui-lib/components';
import _ from 'lodash';
import { ReactNode, useMemo } from 'react';

interface CalendarComponentProps {
  startDate: DateFormat;
  endDate: DateFormat;
  dayParts: DayPart[];
  applications: CosmeticApplication[];
  renderApplications: (arg: {
    date: DateFormat;
    dayPartId: string;
    applications: CosmeticApplication[];
  }) => ReactNode;
}

export function CalendarComponent({
  startDate,
  endDate,
  dayParts,
  applications,
  renderApplications,
}: CalendarComponentProps) {
  const dates = useMemo((): DateFormat[] => {
    return DateUtils.toArray({ start: startDate, end: endDate });
  }, [endDate, startDate]);

  const groupedApplications = useMemo(() => {
    return _.groupBy(applications, application => {
      return application.date;
    });
  }, [applications]);

  return (
    <table>
      <colgroup>
        <col style={{ minWidth: '120px' }} />
        {dayParts.map(currentDayPart => {
          return (
            <col key={currentDayPart.id} style={{ minWidth: '300px', width: '300px' }} />
          );
        })}
      </colgroup>

      <thead>
        <tr>
          <th></th>
          {dayParts.map(currentDayPart => {
            return <th key={currentDayPart.id}>{currentDayPart.name}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {dates.map(currentDate => {
          return (
            <tr key={currentDate}>
              <td>{currentDate}</td>
              {dayParts.map(currentDayPart => {
                const currentApplications =
                  groupedApplications[currentDate]?.filter(
                    application => application.dayPartId === currentDayPart.id,
                  ) || [];

                return (
                  <td key={currentDayPart.id}>
                    <Box spacing={{ p: 2 }}>
                      {renderApplications({
                        date: currentDate,
                        dayPartId: currentDayPart.id,
                        applications: currentApplications,
                      })}
                    </Box>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
