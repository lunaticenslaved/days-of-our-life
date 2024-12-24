import { DateFormat, DateUtils } from '#/shared/models/date';
import { ReactNode, useMemo } from 'react';

import './Timeline.scss';

interface TimelineProps {
  startDate: DateFormat;
  endDate: DateFormat;
  renderCell(date: DateFormat): ReactNode;
}

// FIXME remove timeline
export function Timeline({ startDate, endDate, renderCell }: TimelineProps) {
  const dates = useMemo(() => {
    return DateUtils.toArray({ start: startDate, end: endDate });
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
