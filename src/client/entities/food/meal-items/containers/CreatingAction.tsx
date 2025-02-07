import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import { useCreateFoodMealItem } from '#/client/store';
import { DateFormat } from '#/shared/models/date';
import { FormDialogContainer } from './FormDialog';

interface CreatingActionProps {
  date: DateFormat;
  dayPartId: string;
}

export function CreatingAction({ date, dayPartId }: CreatingActionProps) {
  const mealItemDialog = useDialog();

  const creatingMutation = useCreateFoodMealItem();

  return (
    <>
      <FormDialogContainer
        type="create"
        date={date}
        dayPartId={dayPartId}
        dialog={mealItemDialog}
        onCreated={mealItemDialog.close}
      />

      <Button onClick={mealItemDialog.open} disabled={creatingMutation.isPending}>
        Добавить
      </Button>
    </>
  );
}
