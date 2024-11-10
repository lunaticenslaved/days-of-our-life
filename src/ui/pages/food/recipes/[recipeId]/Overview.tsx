import { useGetFoodRecipeQuery } from '#ui/api/food';
import { useFoodPageParams } from '#ui/pages/food';
import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../../index';
import { FoodNutrientsList } from '#ui/entities/food-nutrients';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const query = useGetFoodRecipeQuery(recipeId);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    return <div>not found</div>;
  }

  const { parts, output, nutrientsPerGram, description } = query.data;

  return (
    <div>
      <h1>{query.data.name}</h1>

      <Link to={FOOD_NAVIGATION.toRecipeEdit({ recipeId: query.data.id })}>
        Редактировать
      </Link>

      <section>
        <h2>Выход</h2>
        <ul>
          {Object.entries(output).map(([key, value]) => {
            return (
              <li key={key}>
                {key} - {value}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Питательные вещества</h2>
        <FoodNutrientsList nutrients={nutrientsPerGram} multiplier={100} />
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
