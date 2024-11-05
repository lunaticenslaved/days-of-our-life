import { useFoodRecipesQuery } from '#ui/api/food/recipes';
import { FOOD_NAVIGATION } from '#ui/pages/food';
import { Link } from 'react-router-dom';

export default function Page() {
  const { data: recipes } = useFoodRecipesQuery();

  return (
    <div>
      <Link to={FOOD_NAVIGATION.toRecipeCreate()}>Создать рецепт</Link>
      <ul>
        {recipes?.map(recipe => {
          return (
            <li key={recipe.id}>
              <Link to={FOOD_NAVIGATION.toRecipeOverview({ recipeId: recipe.id })}>
                {recipe.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
