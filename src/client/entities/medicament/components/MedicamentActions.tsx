import { Button } from '#/ui-lib/atoms/Button';

interface MedicamentActionsProps {
  onEdit(): void;
  onDelete(): void;
}

export function MedicamentActions({ onEdit, onDelete }: MedicamentActionsProps) {
  return (
    <div>
      <Button onClick={onEdit}>Редактировать</Button>
      <Button onClick={onDelete}>Удалить</Button>
    </div>
  );
}
