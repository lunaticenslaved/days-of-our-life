import { ListComponent } from './List.component';

import { useFoodCacheStrict } from '#/client/entities/food/cache';
import { ComponentProps } from 'react';

type ListContainerProps = Pick<
  ComponentProps<typeof ListComponent>,
  'onItemClick' | 'value' | 'onValueUpdate' | 'renderActions'
>;

export function ListContainer(props: ListContainerProps) {
  const cache = useFoodCacheStrict();

  const products = cache.products.list();

  return <ListComponent {...props} products={products} />;
}
