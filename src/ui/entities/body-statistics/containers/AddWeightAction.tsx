import { DateFormat } from '#/shared/models/date';
import { Button } from '#/ui/components/Button';
import { useDialog } from '#/ui/components/Dialog';
import { useCreateBodyWeightMutation } from '#/ui/store/days';

import { BodyWeightFormDialog } from '../components/WeightFormDialog';

interface AddWeightActionProps {
  onUpdated?(): void;
  date: DateFormat;
  weight?: number;
}

export function AddWeightAction({ weight, date, onUpdated }: AddWeightActionProps) {
  const weightDialog = useDialog();
  const createBodyWeightMutation = useCreateBodyWeightMutation();

  return (
    <div style={{ display: 'flex' }}>
      {typeof weight === 'number' && <div>{weight} кг</div>}
      {weightDialog.isOpen && (
        <BodyWeightFormDialog
          weight={weight}
          dialog={weightDialog}
          onSubmit={values => {
            createBodyWeightMutation.mutate({
              date,
              weight: values.weight,
            });
            weightDialog.close();
            onUpdated?.();
          }}
        />
      )}
      <Button onClick={weightDialog.open}>Записать вес</Button>
    </div>
  );
}
