import { Button } from '#/client/components/Button';

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
