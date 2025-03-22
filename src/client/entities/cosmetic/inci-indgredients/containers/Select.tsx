import { useListCosmeticINCIIngredientsQuery } from '#/client/store';
import { ComponentProps } from 'react';

import { MultipleSelectComponent } from '../components/Select';

interface MultipleSelectContainerProps
  extends Omit<ComponentProps<typeof MultipleSelectComponent>, 'entities'> {}

export function MultipleSelectContainer(props: MultipleSelectContainerProps) {
  const listQuery = useListCosmeticINCIIngredientsQuery();

  return <MultipleSelectComponent {...props} entities={listQuery.data || []} />;
}
