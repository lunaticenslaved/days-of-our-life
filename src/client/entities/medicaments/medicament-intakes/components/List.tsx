import { createEntityList } from '#/client/component-factories/EntityList';
import { MedicamentIntake } from '#/shared/models/medicament';

export const ListComponent = createEntityList<MedicamentIntake>({
  entityName: 'MedicamentIntake',
  placeholder: {
    empty: 'Нет приёмов',
  },
  getEntityKey(intake) {
    return intake.id;
  },
  renderEntity(intake) {
    // TODO use normal view
    return intake.medicamentId;
  },
});
