import { DateUtils } from '#/shared/models/date';
import { Button } from '#/ui/components/Button';
import { Timeline } from '#/ui/components/Timeline';
import { useListDayPartsQuery } from '#/ui/entities/day-parts';
import { useMemo } from 'react';

export default function PageView() {
  const dayPartsQuery = useListDayPartsQuery();

  const { startDate, endDate } = useMemo(() => {
    const now = DateUtils.now();

    return {
      startDate: DateUtils.toDateFormat(now),
      endDate: DateUtils.toDateFormat(now.add(30, 'day')),
    };
  }, []);

  if (!dayPartsQuery.data) {
    return null;
  }

  return (
    <div>
      <Timeline
        startDate={startDate}
        endDate={endDate}
        renderCell={() => {
          return dayPartsQuery.data.map(dayPart => {
            return (
              <div key={dayPart.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div>{dayPart.name}:</div>
                <section>
                  <div>Медикаменты</div>
                  <Button>Добавить</Button>
                </section>
              </div>
            );
          });
        }}
      />
    </div>
  );
}
