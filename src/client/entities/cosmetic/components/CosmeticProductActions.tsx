import { Button } from '#/client/components/Button';

interface CosmeticProductActionsProps {
  onEdit(): void;
  onDelete(): void;
}

export function CosmeticProductActions({
  onEdit,
  onDelete,
}: CosmeticProductActionsProps) {
  return (
    <div>
      <Button onClick={onEdit}>Редактировать</Button>
      <Button onClick={onDelete}>Удалить</Button>
    </div>
  );
}
