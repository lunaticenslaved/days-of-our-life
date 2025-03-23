import { DayPart } from '#/shared/models/day';
import { Button } from '#/ui-lib/atoms/Button';
import { DayPartFormDialog } from '#/client/entities/day-parts';
import { useEffect, useState } from 'react';
import { useDeleteDayPartMutation, useListDayPartsQuery } from '#/client/store/days';
import { useDialog } from '#/ui-lib/atoms/Dialog';

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
        {dayParts.data.map(dayPart => {
          return (
            <li key={dayPart.id} style={{ display: 'flex' }}>
              <div>{dayPart.name}</div>
              <Button
                onClick={() => {
                  setDayPartToEdit(dayPart);
                  dialog.open();
                }}>
                Редактировать
              </Button>
              <Button
                onClick={() => {
                  deleting.mutate(dayPart);
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
