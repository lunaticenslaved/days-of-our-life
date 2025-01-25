import { CosmeticIngredient } from '#/shared/models/cosmetic';

import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';
import { ComponentProps } from 'react';

export const CosmeticIngredientMultipleSelect =
  createEntityMultipleSelect<CosmeticIngredient>('CosmeticIngredient', {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  });

export const CosmeticIngredientSingleSelect =
  createEntitySingleSelect<CosmeticIngredient>('CosmeticIngredient', {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  });

export type CosmeticIngredientSingleSelectProps = ComponentProps<
  typeof CosmeticIngredientSingleSelect
>;
