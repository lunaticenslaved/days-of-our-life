import { Button } from '#/ui-lib/atoms/Button';

interface MedicamentIntakeActionsProps {
  onDelete(): void;
}

export function MedicamentIntakeActions({ onDelete }: MedicamentIntakeActionsProps) {
  return (
    <div>
      <Button onClick={onDelete}>Удалить</Button>
    </div>
  );
}
