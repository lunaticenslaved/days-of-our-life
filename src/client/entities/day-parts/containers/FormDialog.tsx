import { ComponentProps } from 'react';
import { FormDialogComponent } from '../components/Form';
import { DayPart } from '#/shared/models/day';
import { useCreateDayPartMutation, useUpdateDayPartMutation } from '#/client/store/days';

type FormDialogProps = Pick<ComponentProps<typeof FormDialogComponent>, 'dialog'> & {
  dayPart?: DayPart;
  closeOnSubmit?: boolean;
};

export function FormDialog({ closeOnSubmit, ...props }: FormDialogProps) {
  const { dayPart } = props;

  const creating = useCreateDayPartMutation({
    onSuccess: closeOnSubmit ? props.dialog.close : undefined,
  });
  const updating = useUpdateDayPartMutation({
    onSuccess: closeOnSubmit ? props.dialog.close : undefined,
  });

  return (
    <FormDialogComponent
      {...props}
      isPending={creating.isPending || updating.isPending}
      onSubmit={values =>
        dayPart
          ? updating.mutate({
              oldItem: dayPart,
              newValues: values,
            })
          : creating.mutate(values)
      }
    />
  );
}
