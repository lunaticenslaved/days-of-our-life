import { useListFoodRecipesQuery } from '#ui/entities/food';
import { FOOD_NAVIGATION } from '#ui/pages/food';
import { Link } from 'react-router-dom';

export default function Page() {
  const { data: recipes } = useListFoodRecipesQuery();

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
