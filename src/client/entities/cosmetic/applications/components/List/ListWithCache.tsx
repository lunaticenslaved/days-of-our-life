import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { ComponentProps, ReactNode } from 'react';
import { ListComponent } from './List';
import { CosmeticApplication } from '#/shared/models/cosmetic/applications';
import _ from 'lodash';
import { useListCosmeticProductsQuery } from '#/client/entities/cosmetic/products';
import { useListCosmeticRecipesQuery } from '#/client/entities/cosmetic/recipes';

type ListWithCacheProps = Pick<
  ComponentProps<typeof ListComponent>,
  'hideSearch' | 'onOrderUpdate'
> & {
  applications: Array<{ id: string }>;
  renderActions?: (appl: CosmeticApplication) => ReactNode;
};

export function ListWithCache({
  applications,
  renderActions,
  ...props
}: ListWithCacheProps) {
  const cache = useCosmeticCacheStrict();

  useListCosmeticProductsQuery();
  useListCosmeticRecipesQuery();

  const items = _.orderBy(
    cache.applications.list(applications.map(appl => appl.id)),
    item => item.order,
    'asc',
  );

  return (
    <ListComponent
      {...props}
      applications={items}
      getProduct={arg => cache.products.find(arg.productId)}
      getRecipe={arg => cache.recipes.find(arg.recipeId)}
      renderActions={
        renderActions
          ? ({ id }) => {
              const appl = cache.applications.find(id);

              return appl ? renderActions(appl) : null;
            }
          : undefined
      }
    />
  );
}
