import { ComponentProps, useMemo } from 'react';
import { ListComponent } from './List.component';
import { useListFoodRecipesQuery } from '#/client/entities/food/recipes';
import { useFoodCacheStrict } from '#/client/entities/food/cache';

type ListComponentProps = ComponentProps<typeof ListComponent>;

export { ListComponent as FoodRecipesList };

export function useFoodRecipeListContainer(): Pick<
  ListComponentProps,
  'isFetching' | 'recipes'
> {
  const cache = useFoodCacheStrict();
  const query = useListFoodRecipesQuery();

  return useMemo(() => {
    return {
      isFetching: query.isFetching,
      recipes: cache.recipes.list(query.data?.map(recipe => recipe.id) || []),
    };
  }, [cache.recipes, query.data, query.isFetching]);
}
