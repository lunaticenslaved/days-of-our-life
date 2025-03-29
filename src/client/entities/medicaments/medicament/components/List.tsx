import { createEntityList } from '#/client/component-factories/EntityList';
import { Medicament } from '#/shared/models/medicament';

import { getMedicamentKeywords } from '../utils';

export const ListComponent = createEntityList<Medicament>({
  entityName: 'Medicament',
  placeholder: {
    empty: 'Нет медикаментов',
  },
  getEntityKeywords: getMedicamentKeywords,
  getEntityKey(medicament) {
    return medicament.id;
  },
  renderEntity(medicament) {
    return medicament.name;
  },
});
