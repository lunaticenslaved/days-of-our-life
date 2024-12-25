import { DayPart } from '#/shared/models/day';
import { Button } from '#/client/components/Button';
import { useDialog } from '#/client/components/Dialog';
import {
  useDeleteDayPartMutation,
  useListDayPartsQuery,
} from '#/client/entities/day-parts';
import { DayPartFormDialog } from '#/client/entities/day-parts/containers/DayPartFormDialog';
import { useEffect, useState } from 'react';

export default function Page() {
  const dialog = useDialog();
  const [dayPartToEdit, setDayPartToEdit] = useState<DayPart>();

  const dayParts = useListDayPartsQuery();

  const deleting = useDeleteDayPartMutation({
    onSuccess: () => {
      dayParts.refetch();
    },
  });

  useEffect(() => {
    if (!dialog.isOpen) {
      setDayPartToEdit(undefined);
    }
  }, [dialog.isOpen]);

  if (!dayParts.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DayPartFormDialog dayPart={dayPartToEdit} dialog={dialog} closeOnSubmit />

      <Button onClick={dialog.open}>Добавить</Button>

      <ul>
        {dayParts.data.map(part => {
          return (
            <li key={part.id} style={{ display: 'flex' }}>
              <div>{part.name}</div>
              <Button
                onClick={() => {
                  setDayPartToEdit(part);
                  dialog.open();
                }}>
                Редактировать
              </Button>
              <Button
                onClick={() => {
                  deleting.mutate({ id: part.id });
                }}>
                Удалить
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
