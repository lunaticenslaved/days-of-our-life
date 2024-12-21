import { Button } from '#/ui/components/Button';

interface MedicamentIntakeActionsProps {
  onEdit(): void;
  onDelete(): void;
}

export function MedicamentIntakeActions({
  onEdit,
  onDelete,
}: MedicamentIntakeActionsProps) {
  return (
    <div>
      <Button onClick={onEdit}>Редактировать</Button>
      <Button onClick={onDelete}>Удалить</Button>
    </div>
  );
}
