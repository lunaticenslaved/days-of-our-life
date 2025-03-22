import { CosmeticProduct } from '#/shared/models/cosmetic';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';

export const MultipleSelect = createEntityMultipleSelect<CosmeticProduct>(
  'CosmeticProduct',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const SingleSelect = createEntitySingleSelect<CosmeticProduct>('CosmeticProduct', {
  getValue: entity => entity.id,
  renderOption: entity => <>{entity.name}</>,
});
