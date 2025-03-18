import { CosmeticRecipeActions } from './Actions';
import { useListCosmeticRecipesQuery } from '#/client/store';
import { Link } from 'react-router-dom';
import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Box } from '#/ui-lib/atoms/Box';

interface CosmeticRecipesListProps {}

export function CosmeticRecipesList(_: CosmeticRecipesListProps) {
  const { data = [], refetch } = useListCosmeticRecipesQuery();

  if (!data.length) {
    return <div>Нет рецептов</div>;
  }

  return (
    <ul>
      {data.map(recipe => {
        return (
          <li key={recipe.id} style={{ display: 'flex' }}>
            <Flex alignItems="center" style={{ width: '100%' }}>
              <Box flexGrow={1}>
                <Link to={COSMETIC_NAVIGATION.toRecipeOverview({ recipeId: recipe.id })}>
                  {recipe.name}
                </Link>
              </Box>

              <CosmeticRecipeActions recipe={recipe} onDeleted={() => refetch()} />
            </Flex>
          </li>
        );
      })}
    </ul>
  );
}
