import { useFoodPageParams } from '#ui/pages/food';
import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../../index';
import {
  FoodRecipeOutput,
  useGetFoodRecipeQuery,
  FoodNutrientsList,
} from '#ui/entities/food';
import { multiplyNutrients } from '#shared/models/food';

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
  const gramsPerPortion = output.grams / output.servings;

  return (
    <div>
      <h1>{query.data.name}</h1>

      <Link to={FOOD_NAVIGATION.toRecipeEdit({ recipeId: query.data.id })}>
        Редактировать
      </Link>

      <section>
        <h2>Выход</h2>
        <FoodRecipeOutput output={output} />
      </section>

      <section>
        <h2>Питательные вещества</h2>

        <section>
          <h3>На 100 г</h3>
          <FoodNutrientsList nutrients={multiplyNutrients(nutrientsPerGram, 100)} />
        </section>

        <section>
          <h3>На 1 порцию</h3>
          <FoodNutrientsList
            nutrients={multiplyNutrients(nutrientsPerGram, gramsPerPortion)}
          />
        </section>
      </section>

      <section>
        <h2>Части рецепта</h2>
        {parts.map(({ id, title, ingredients, description }) => {
          const descriptionItems = (description ?? '').split('\n').filter(Boolean);

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
                        {ingredient.description && (
                          <>
                            {' - '}
                            <span>{ingredient.description}</span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>

              {descriptionItems.length > 0 && (
                <section>
                  <h4>Подготовка</h4>
                  <ul>
                    {descriptionItems.map((text, index) => {
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
        <ol>
          {description.split('\n').map((text, index) => {
            return <li key={index}>{text}</li>;
          })}
        </ol>
      </section>
    </div>
  );
}
