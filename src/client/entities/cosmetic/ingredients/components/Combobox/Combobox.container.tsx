import { ComponentProps, useMemo } from 'react';
import { ComboboxComponent } from './Combobox.component';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';

type ComboboxContainerProps = Pick<
  ComponentProps<typeof ComboboxComponent>,
  'value' | 'onValueUpdate' | 'onItemClick' | 'renderActions' | 'trigger'
>;

export function ComboboxContainer(props: ComboboxContainerProps) {
  const cache = useCosmeticCacheStrict();
  const items = useMemo(() => {
    return cache.ingredients.list();
  }, [cache.ingredients]);

  return <ComboboxComponent {...props} ingredients={items} />;
}
