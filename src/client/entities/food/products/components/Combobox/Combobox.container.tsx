import { ComponentProps, useMemo } from 'react';
import { ComboboxComponent } from './Combobox.component';
import { useFoodCacheStrict } from '#/client/entities/food/cache';

type ComboboxContainerProps = Pick<
  ComponentProps<typeof ComboboxComponent>,
  'value' | 'onValueUpdate' | 'onItemClick' | 'renderActions' | 'trigger'
>;

export function ComboboxContainer(props: ComboboxContainerProps) {
  const cache = useFoodCacheStrict();

  const items = useMemo(() => {
    return cache.products.list();
  }, [cache.products]);

  return <ComboboxComponent {...props} products={items} />;
}
