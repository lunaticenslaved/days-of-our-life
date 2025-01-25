import { CosmeticRecipeActions } from './CosmeticRecipeActions';
import { useListCosmeticRecipesQuery } from '#/client/store';

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
            <div>{recipe.name}</div>
            <CosmeticRecipeActions recipe={recipe} onDeleted={() => refetch()} />
          </li>
        );
      })}
    </ul>
  );
}
