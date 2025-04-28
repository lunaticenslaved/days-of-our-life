import { useCreateCosmeticApplicationMutation } from '../../store';
import { DateFormat } from '#/shared/models/date';
import { nonReachable } from '#/shared/utils';
import { CreatingAction } from './CreatingAction';
import { useListCosmeticProductsQuery } from '#/client/entities/cosmetic/products';
import { useListCosmeticRecipesQuery } from '#/client/entities/cosmetic/recipes';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { useMemo } from 'react';

export function CreatingActionContainer({
  date,
  dayPartId,
}: {
  date: DateFormat;
  dayPartId: string;
}) {
  useListCosmeticProductsQuery();
  useListCosmeticRecipesQuery();

  const creatingMutation = useCreateCosmeticApplicationMutation();

  const cache = useCosmeticCacheStrict();

  const { products, recipes } = useMemo(() => {
    return {
      products: cache.products.list(),
      recipes: cache.recipes.list(),
    };
  }, [cache.products, cache.recipes]);

  return (
    <CreatingAction
      products={products}
      recipes={recipes}
      onItemSelect={values => {
        if (values.type === 'product') {
          creatingMutation.mutate({
            date,
            dayPartId,
            source: {
              type: 'product',
              productId: values.productId,
            },
          });
        } else if (values.type === 'recipe') {
          creatingMutation.mutate({
            date,
            dayPartId,
            source: {
              type: 'recipe',
              recipeId: values.recipeId,
            },
          });
        } else {
          nonReachable(values);
        }
      }}
    />
  );
}
