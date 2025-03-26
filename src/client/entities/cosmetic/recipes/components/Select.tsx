import { CosmeticRecipe } from '#/shared/models/cosmetic';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';

export const MultipleSelect = createEntityMultipleSelect<CosmeticRecipe>(
  'CosmeticRecipe',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const SingleSelect = createEntitySingleSelect<CosmeticRecipe>('CosmeticRecipe', {
  getValue: entity => entity.id,
  renderOption: entity => <>{entity.name}</>,
});
