import { Medicament } from '#/shared/models/medicament';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';

export const MultipleSelectComponent = createEntityMultipleSelect<Medicament>(
  'Medicament',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const SingleSelectComponent = createEntitySingleSelect<Medicament>('Medicament', {
  getValue: entity => entity.id,
  renderOption: entity => <>{entity.name}</>,
});
