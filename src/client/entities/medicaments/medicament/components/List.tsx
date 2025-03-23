import { createEntityList } from '#/client/component-factories/EntityList';
import { Medicament } from '#/shared/models/medicament';

export const ListComponent = createEntityList<Medicament>({
  entityName: 'Medicament',
  placeholder: {
    empty: 'Нет медикаментов',
  },
  getEntityKey(medicament) {
    return medicament.id;
  },
  renderEntity(medicament) {
    return medicament.name;
  },
});
