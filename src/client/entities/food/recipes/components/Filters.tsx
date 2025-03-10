import { FoodRecipe } from '#/shared/models/food';
import { Flex } from '#/ui-lib/atoms/Flex';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { InputProps } from '#/ui-lib/types';
import { useCallback, useState } from 'react';

type FoodRecipeFiltersValues = {
  search: string | null;
};

type FoodRecipeFiltersProps = InputProps<FoodRecipeFiltersValues>;

export function FoodRecipeFilters({ value, onValueUpdate }: FoodRecipeFiltersProps) {
  const update = (newValue: Partial<FoodRecipeFiltersValues>) => {
    onValueUpdate({
      ...value,
      ...newValue,
    });
  };

  return (
    <Flex>
      <TextInput
        placeholder="Поиск"
        value={value.search}
        onValueUpdate={search => update({ search })}
      />
    </Flex>
  );
}

export function useFoodRecipeFilters() {
  const [value, onValueUpdate] = useState<FoodRecipeFiltersValues>({
    search: null,
  });

  const filter = useCallback(
    (recipes: FoodRecipe[]): FoodRecipe[] => {
      const filters: Array<(product: FoodRecipe) => boolean> = [];

      if (value.search) {
        const searchStr = (value.search || '').toLocaleLowerCase();

        filters.push(recipe => recipe.name.toLocaleLowerCase().includes(searchStr));
      }

      if (filters.length === 0) {
        return recipes;
      }

      return recipes.filter(recipe => filters.every(fn => fn(recipe)));
    },
    [value.search],
  );

  return {
    value,
    onValueUpdate,
    filter,
  };
}
