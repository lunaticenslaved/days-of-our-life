import { useGetFoodRecipeQuery } from '#ui/api/food';
import { useFoodPageParams } from '#ui/pages/food';
import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../../index';
import { FoodRecipeStatsType } from '#shared/models/FoodRecipe';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const query = useGetFoodRecipeQuery(recipeId);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    return <div>not found</div>;
  }

  const { parts, stats, description } = query.data;

  return (
    <div>
      <h1>{query.data.name}</h1>

      <Link to={FOOD_NAVIGATION.toRecipeEdit({ recipeId: query.data.id })}>
        Редактировать
      </Link>

      <section>
        <h2>Статистика</h2>
        <ul>
          {Object.entries(stats).map(([str, { quantity, nutrients }]) => {
            const type = str as FoodRecipeStatsType;

            return (
              <li key={str}>
                <div>
                  {type} - {quantity}
                </div>
                <div>Калории - {nutrients.calories} ккал</div>
                <div>Белки - {nutrients.proteins} г</div>
                <div>Жиры - {nutrients.fats} г</div>
                <div>Углеводы - {nutrients.carbs} г</div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Части рецепта</h2>
        {parts.map(({ id, title, ingredients, description }) => {
          const descriptionItems = (description ?? '').split('\n');

          return (
            <section key={id}>
              <h3>{title}</h3>

              <section>
                <h4>Ингредиенты</h4>
                <ul>
                  {ingredients.map(ingredient => {
                    return (
                      <li key={ingredient.id}>
                        <span>{ingredient.product.name}</span>
                        {' - '}
                        <span>{ingredient.grams} грамм</span>
                        {' - '}
                        <span>{ingredient.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {descriptionItems.length > 0 && (
                <section>
                  <h4>Подготовка</h4>
                  <ul>
                    {(description ?? '').split('\n').map((text, index) => {
                      return <li key={index}>{text}</li>;
                    })}
                  </ul>
                </section>
              )}
            </section>
          );
        })}
      </section>

      <section>
        <h2>Как готовить</h2>
        <ul>
          {description.split('\n').map((text, index) => {
            return <li key={index}>{text}</li>;
          })}
        </ul>
      </section>
    </div>
  );
}
