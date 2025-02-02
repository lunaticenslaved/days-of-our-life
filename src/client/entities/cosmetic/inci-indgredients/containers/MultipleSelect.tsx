import { createEntityMultipleSelect } from '#/client/component-factories/EntitySelect';
import { useListCosmeticINCIIngredientsQuery } from '#/client/store';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { ComponentProps } from 'react';

const BaseMultipleSelect = createEntityMultipleSelect<CosmeticINCIIngredient>(
  'CosmeticINCIIngredient',
  {
    getValue: entity => entity.id,
    renderOption: entity => <>{entity.name}</>,
  },
);

interface BaseMultipleSelectProps extends ComponentProps<typeof BaseMultipleSelect> {}

interface CosmeticINCIIngredientMultipleSelectProps
  extends Omit<BaseMultipleSelectProps, 'entities'> {}

export function CosmeticINCIIngredientMultipleSelect(
  props: CosmeticINCIIngredientMultipleSelectProps,
) {
  const listQuery = useListCosmeticINCIIngredientsQuery();

  return <BaseMultipleSelect {...props} entities={listQuery.data || []} />;
}
