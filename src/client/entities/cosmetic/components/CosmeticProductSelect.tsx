import { CosmeticProduct } from '#/shared/models/cosmetic';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';
import { ComponentProps } from 'react';

export const CosmeticProductMultipleSelect = createEntityMultipleSelect<CosmeticProduct>(
  'CosmeticProduct',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const CosmeticProductSingleSelect = createEntitySingleSelect<CosmeticProduct>(
  'CosmeticProduct',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export type CosmeticProductSingleSelectProps = ComponentProps<
  typeof CosmeticProductSingleSelect
>;
