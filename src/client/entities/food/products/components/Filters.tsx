import { FoodProduct } from '#/shared/models/food';
import { Flex } from '#/ui-lib/atoms/Flex';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { InputProps } from '#/ui-lib/types';
import { useCallback, useState } from 'react';

type FoodProductFiltersValues = {
  search?: string;
};

type FoodProductFiltersProps = InputProps<FoodProductFiltersValues>;

export function FoodProductFilters({ value, onValueUpdate }: FoodProductFiltersProps) {
  const update = (newValue: Partial<FoodProductFiltersValues>) => {
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

export function useFoodProductFilters() {
  const [value, onValueUpdate] = useState<FoodProductFiltersValues>({
    search: undefined,
  });

  const filter = useCallback(
    (products: FoodProduct[]): FoodProduct[] => {
      const filters: Array<(product: FoodProduct) => boolean> = [];

      if (value.search) {
        const searchStr = (value.search || '').toLocaleLowerCase();

        filters.push(product => product.name.toLocaleLowerCase().includes(searchStr));
      }

      if (filters.length === 0) {
        return products;
      }

      return products.filter(product => filters.every(fn => fn(product)));
    },
    [value.search],
  );

  return {
    value,
    onValueUpdate,
    filter,
  };
}
