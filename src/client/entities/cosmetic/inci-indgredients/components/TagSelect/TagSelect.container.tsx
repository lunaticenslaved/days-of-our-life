import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { useListCosmeticINCIIngredientsQuery } from '#/client/entities/cosmetic/inci-indgredients/store';
import { WithInputProps } from '#/ui-lib/types';
import { TagSelectComponent } from './TagSelect.component';

type TagSelectContainerProps = WithInputProps<string[] | undefined>;

export function TagSelectContainer(props: TagSelectContainerProps) {
  const cache = useCosmeticCacheStrict();

  useListCosmeticINCIIngredientsQuery();

  return <TagSelectComponent {...props} ingredients={cache.inciIngredients.list()} />;
}
