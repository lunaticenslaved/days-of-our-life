import { useCosmeticNavigation } from '#/client/pages/cosmetic';
import { useListCosmeticRecipesQuery } from '#/client/store';

import { ListComponent } from '../components/List';

interface CosmeticRecipesListProps {}

export function CosmeticRecipesList(_: CosmeticRecipesListProps) {
  const listQuery = useListCosmeticRecipesQuery();
  const cosmeticNavigation = useCosmeticNavigation();

  // TODO use link here
  return (
    <ListComponent
      entities={listQuery.data || []}
      onEntityClick={recipe =>
        cosmeticNavigation.toRecipeOverview({ recipeId: recipe.id })
      }
    />
  );
}
