import { ComponentProps } from 'react';
import { CompoboxComponent } from './Combobox.component';
import { useFoodRecipeListContainer } from '#/client/entities/food/recipes/components/List';

type CompoboxComponentProps = ComponentProps<typeof CompoboxComponent>;

export { CompoboxComponent as FoodRecipeCombobox };

export function useFoodRecipeComboboxContainer(): Pick<
  CompoboxComponentProps,
  'recipes' | 'isFetching'
> {
  return useFoodRecipeListContainer();
}
