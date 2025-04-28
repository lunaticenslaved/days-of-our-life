import {
  useCreateCosmeticApplicationMutation,
  useListCosmeticApplicationsQuery,
  useReorderCometicApplications,
} from '../../store';
import { useListDayPartsQuery } from '#/client/store';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { useState } from 'react';
import { CalendarComponent } from './Calendar.component';
import { CosmeticApplicationsList } from '../List';

import { CosmeticApplicationCreatingAction } from '../CreatingAction';
import { CosmeticApplicationActions } from '../Actions';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Button } from '#/ui-lib/atoms/Button';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';

const startDate = DateUtils.toDateFormat(DateUtils.now().subtract(30, 'days'));
const endDate = DateUtils.toDateFormat(DateUtils.now().add(30, 'days'));

export function CalendarContainer() {
  const dayPartsQuery = useListDayPartsQuery();
  const applicationsQuery = useListCosmeticApplicationsQuery({ startDate, endDate });

  const [clipboard, setClipboard] = useState<CosmeticApplication[]>();
  const creatingMutation = useCreateCosmeticApplicationMutation();

  return (
    <CalendarComponent
      startDate={startDate}
      endDate={endDate}
      dayParts={dayPartsQuery.data || []}
      applications={applicationsQuery.data || []}
      renderApplications={data => {
        return (
          <>
            <Flex gap={1}>
              <CosmeticApplicationCreatingAction
                date={data.date}
                dayPartId={data.dayPartId}
              />
              {data.applications.length > 0 && (
                <Button
                  view="toned"
                  onClick={() => {
                    setClipboard(data.applications);
                  }}>
                  Копировать
                </Button>
              )}
              {!!clipboard?.length && (
                <Button
                  view="toned"
                  onClick={async () => {
                    for (const application of clipboard) {
                      await creatingMutation.mutateAsync({
                        date: data.date,
                        dayPartId: data.dayPartId,
                        source: application.source,
                      });
                    }
                  }}>
                  Вставить
                </Button>
              )}
            </Flex>

            <ApplicationsList
              date={data.date}
              dayPartId={data.dayPartId}
              applications={data.applications}
            />
          </>
        );
      }}
    />
  );
}

function ApplicationsList({
  applications,
  date,
  dayPartId,
}: {
  date: DateFormat;
  dayPartId: string;
  applications: CosmeticApplication[];
}) {
  const reordering = useReorderCometicApplications({
    date,
    dayPartId,
  });

  return (
    <CosmeticApplicationsList
      hideSearch
      applications={applications}
      onOrderUpdate={newValue => {
        reordering.mutate({
          date,
          dayPartId,
          applications: newValue.map(({ id }) => ({ id })),
        });
      }}
      renderActions={application => {
        return (
          <CosmeticApplicationActions
            applicationId={application.id}
            onDeleted={() => null}
          />
        );
      }}
    />
  );
}
