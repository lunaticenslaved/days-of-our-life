import { FoodRecipe } from '#/shared/models/food';
import {
  createEntityMultipleSelect,
  createEntitySingleSelect,
} from '#/client/component-factories/EntitySelect';
import { ComponentProps } from 'react';

export const FoodRecipeMultipleSelect = createEntityMultipleSelect<FoodRecipe>(
  'FoodRecipe',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

export const FoodRecipeSingleSelect = createEntitySingleSelect<FoodRecipe>('FoodRecipe', {
  getValue: entity => entity.id,
  renderOption: entity => <>{entity.name}</>,
});

export type FoodRecipeSingleSelectProps = ComponentProps<typeof FoodRecipeSingleSelect>;
