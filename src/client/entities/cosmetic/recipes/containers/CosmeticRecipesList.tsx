import { CosmeticRecipeActions } from './CosmeticRecipeActions';
import { useListCosmeticRecipesQuery } from '#/client/store';
import { Link } from 'react-router-dom';
import { COSMETIC_NAVIGATION } from '#/client/pages/cosmetic';

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
            <Link to={COSMETIC_NAVIGATION.toRecipeOverview({ recipeId: recipe.id })}>
              {recipe.name}
            </Link>

            <CosmeticRecipeActions recipe={recipe} onDeleted={() => refetch()} />
          </li>
        );
      })}
    </ul>
  );
}
