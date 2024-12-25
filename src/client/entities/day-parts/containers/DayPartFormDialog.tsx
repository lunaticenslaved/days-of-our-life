import { ComponentProps } from 'react';
import { DayPartFormDialog as BaseDayPartFormDialog } from '../components/DayPartFormDialog';
import {
  useCreateDayPartMutation,
  useUpdateDayPartMutation,
} from '#/client/entities/day-parts/api';
import { DayPart } from '#/shared/models/day';

type DayPartFormDialogProps = Pick<
  ComponentProps<typeof BaseDayPartFormDialog>,
  'dialog'
> & {
  dayPart?: DayPart;
  closeOnSubmit?: boolean;
};

export function DayPartFormDialog({ closeOnSubmit, ...props }: DayPartFormDialogProps) {
  const { dayPart } = props;

  const creating = useCreateDayPartMutation({
    onSuccess: closeOnSubmit ? props.dialog.close : undefined,
  });
  const updating = useUpdateDayPartMutation({
    onSuccess: closeOnSubmit ? props.dialog.close : undefined,
  });

  return (
    <BaseDayPartFormDialog
      {...props}
      onSubmit={values =>
        dayPart ? updating.mutate({ id: dayPart.id, ...values }) : creating.mutate(values)
      }
    />
  );
}
