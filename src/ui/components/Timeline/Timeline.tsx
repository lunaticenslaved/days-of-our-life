import dayjs from '#/shared/libs/dayjs';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { ReactNode, useMemo } from 'react';

import './Timeline.scss';

interface TimelineProps {
  startDate: DateFormat;
  endDate: DateFormat;
  renderCell(date: DateFormat): ReactNode;
}

export function Timeline({ startDate, endDate, renderCell }: TimelineProps) {
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

  return (
    <div className="Timeline">
      {dates.map(date => {
        return (
          <div key={date} className="Timeline_cell">
            <div>{date}</div>
            <div>{renderCell(date)}</div>
          </div>
        );
      })}
    </div>
  );
}
