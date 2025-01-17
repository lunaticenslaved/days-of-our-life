import { Medicament } from '#/shared/models/medicament';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';
import { ComponentProps } from 'react';

export const MedicamentMultipleSelect = createEntityMultipleSelect<Medicament>(
  'Medicament',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const MedicamentSingleSelect = createEntitySingleSelect<Medicament>('Medicament', {
  getValue: entity => entity.id,
  renderOption: entity => <>{entity.name}</>,
});

export type MedicamentSingleSelectProps = ComponentProps<typeof MedicamentSingleSelect>;
