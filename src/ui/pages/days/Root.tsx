import { DateFormat, DateUtils } from '#/shared/models/date';
import { DayPart } from '#/shared/models/day';
import { MedicamentIntake, MedicamentUtils } from '#/shared/models/medicament';
import { Button } from '#/ui/components/Button';
import { useDialog } from '#/ui/components/Dialog';
import { Timeline } from '#/ui/components/Timeline';
import { useListDayPartsQuery } from '#/ui/entities/day-parts';
import {
  useCreateMedicamentIntakeMutation,
  useDeleteMedicamentIntakeMutation,
  useListMedicamentIntakesQuery,
  useListMedicamentsQuery,
  useUpdateMedicamentIntakeMutation,
} from '#/ui/entities/medicament/api';
import {
  MedicamentIntakeActions,
  MedicamentIntakeFormDialog,
  MedicamentIntakesList,
} from '#/ui/entities/medicament/components';
import { useEffect, useMemo, useState } from 'react';

export default function PageView() {
  const { startDate, endDate } = useMemo(() => {
    const now = DateUtils.now();

    return {
      startDate: DateUtils.toDateFormat(now),
      endDate: DateUtils.toDateFormat(now.add(30, 'day')),
    };
  }, []);

  const medicamentIntakeDialog = useDialog();

  const dayPartsQuery = useListDayPartsQuery();
  const listMedicamentsQuery = useListMedicamentsQuery();
  const listMedicamentIntakesQuery = useListMedicamentIntakesQuery({
    startDate,
    endDate,
  });
  const createMedicamentIntakeMutation = useCreateMedicamentIntakeMutation({
    onMutate: () => {
      medicamentIntakeDialog.close();
    },
  });
  const updateMedicamentIntakeMutation = useUpdateMedicamentIntakeMutation({
    onMutate: () => {
      medicamentIntakeDialog.close();
    },
  });
  const deleteMedicamentIntakeMutation = useDeleteMedicamentIntakeMutation();

  const [selectedDate, setSelectedDate] = useState<DateFormat>();
  const [selectedDayPart, setSelectedDayPart] = useState<DayPart>();
  const [medicamentIntakeToEdit, setMedicamentIntakeToEdit] =
    useState<MedicamentIntake>();

  const preparedMedicamentIntakes = useMemo(() => {
    const intakes = listMedicamentIntakesQuery.data || [];

    return MedicamentUtils.zipIntakesByDateAndDatePart(intakes);
  }, [listMedicamentIntakesQuery.data]);

  useEffect(() => {
    if (!medicamentIntakeDialog.isOpen) {
      setMedicamentIntakeToEdit(undefined);
      setSelectedDayPart(undefined);
      setSelectedDate(undefined);
    }
  }, [medicamentIntakeDialog.isOpen, selectedDayPart]);

  function openIntakeDialog({
    date,
    dayPart,
    intake,
  }: {
    date: DateFormat;
    dayPart: DayPart;
    intake?: MedicamentIntake;
  }) {
    medicamentIntakeDialog.open();
    setSelectedDate(date);
    setSelectedDayPart(dayPart);
    setMedicamentIntakeToEdit(intake);
  }

  if (!dayPartsQuery.data || !listMedicamentsQuery.data) {
    return null;
  }

  return (
    <div>
      {selectedDate && selectedDayPart && (
        <MedicamentIntakeFormDialog
          type={medicamentIntakeToEdit ? 'edit' : 'create'}
          medicamentId={medicamentIntakeToEdit?.medicamentId}
          date={selectedDate}
          dayPartId={selectedDayPart.id}
          dialog={medicamentIntakeDialog}
          medicaments={listMedicamentsQuery.data || []}
          onSubmit={values => {
            if (medicamentIntakeToEdit) {
              updateMedicamentIntakeMutation.mutate({
                id: medicamentIntakeToEdit.id,
                date: values.date,
                medicamentId: values.medicamentId,
                dayPartId: values.dayPartId,
              });
            } else {
              createMedicamentIntakeMutation.mutate({
                date: values.date,
                medicamentId: values.medicamentId,
                dayPartId: values.dayPartId,
              });
            }
          }}
        />
      )}

      <Timeline
        startDate={startDate}
        endDate={endDate}
        renderCell={date => {
          return dayPartsQuery.data.map(dayPart => {
            const intakes = preparedMedicamentIntakes[date]?.[dayPart.id] || [];

            return (
              <div key={dayPart.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div>{dayPart.name}:</div>
                <section>
                  <div style={{ display: 'flex' }}>
                    <div>Медикаменты</div>
                    <Button
                      onClick={() => {
                        openIntakeDialog({ date, dayPart });
                      }}>
                      Добавить
                    </Button>
                  </div>
                  <MedicamentIntakesList
                    medicaments={listMedicamentsQuery.data}
                    intakes={intakes}
                    renderActions={intake => {
                      return (
                        <MedicamentIntakeActions
                          onEdit={() => {
                            openIntakeDialog({ date, dayPart, intake });
                          }}
                          onDelete={() =>
                            deleteMedicamentIntakeMutation.mutate({ id: intake.id })
                          }
                        />
                      );
                    }}
                  />
                </section>
              </div>
            );
          });
        }}
      />
    </div>
  );
}
