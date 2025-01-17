import { FoodProduct } from '#/shared/models/food';
import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';
import { ComponentProps } from 'react';

export const FoodProductMultipleSelect = createEntityMultipleSelect<FoodProduct>(
  'FoodProduct',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const FoodProductSingleSelect = createEntitySingleSelect<FoodProduct>(
  'FoodProduct',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export type FoodProductSingleSelectProps = ComponentProps<typeof FoodProductSingleSelect>;
