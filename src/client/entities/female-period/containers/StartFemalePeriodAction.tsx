import { Button } from '#/client/components/Button';
import {
  useDeleteFemalePeriodMutation,
  useStartFemalePeriodMutation,
} from '#/client/store';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { FemalePeriod } from '#/shared/models/female-period';

interface StartFemalePeriodActionProps {
  date: DateFormat;
  femalePeriod?: FemalePeriod | null;
}

export function StartFemalePeriodAction({
  date,
  femalePeriod,
}: StartFemalePeriodActionProps) {
  const diff = femalePeriod
    ? DateUtils.diff(date, femalePeriod.startDate, 'days') + 1
    : undefined;

  const startFemalePeriodMutation = useStartFemalePeriodMutation();
  const deleteFemalePeriodMutation = useDeleteFemalePeriodMutation();

  return (
    <div>
      <div>{typeof diff === 'number' ? diff : null}</div>

      {(diff !== 1 || diff === undefined) && (
        <Button
          onClick={() => {
            startFemalePeriodMutation.mutate({
              startDate: date,
            });
          }}>
          Начать период
        </Button>
      )}
      {typeof diff === 'number' && diff === 1 && (
        <Button
          onClick={() => {
            deleteFemalePeriodMutation.mutate({
              startDate: date,
            });
          }}>
          Удалить период
        </Button>
      )}
    </div>
  );
}
