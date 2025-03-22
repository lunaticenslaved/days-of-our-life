import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';

export const MultipleSelectComponent = createEntityMultipleSelect<CosmeticINCIIngredient>(
  'CosmeticINCIIngredient',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const SingleSelectComponent = createEntitySingleSelect<CosmeticINCIIngredient>(
  'CosmeticINCIIngredient',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);
