import { CosmeticIngredient } from '#/shared/models/cosmetic';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';

export const MultipleSelect = createEntityMultipleSelect<CosmeticIngredient>(
  'CosmeticIngredient',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const SingleSelect = createEntitySingleSelect<CosmeticIngredient>(
  'CosmeticIngredient',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);
