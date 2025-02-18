import { useFoodPageParams } from '#/client/pages/food';
import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../../index';
import { FoodRecipeOutput, FoodNutrientsList } from '#/client/entities/food';
import { multiplyNutrients } from '#/shared/models/food';
import { useState } from 'react';
import { NumberInput } from '#/client/components/NumberInput';
import { useGetFoodRecipeQuery } from '#/client/store';

export default function Page() {
  const { recipeId = '' } = useFoodPageParams();
  const query = useGetFoodRecipeQuery(recipeId);

  const [testGrams, setTestGrams] = useState<number>();

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
          <NumberInput modelValue={testGrams} onModelValueChange={setTestGrams} />
          {testGrams && (
            <div>
              Проверка калорийности - {testGrams * query.data.nutrientsPerGram.calories}
            </div>
          )}
          <FoodNutrientsList nutrients={multiplyNutrients(nutrientsPerGram, 100)} />
        </section>

        <section>
          <h3>На 1 порцию ({gramsPerPortion} г)</h3>
          <FoodNutrientsList
            nutrients={multiplyNutrients(nutrientsPerGram, gramsPerPortion)}
          />
        </section>
      </section>

      <section>
        <h2>Части рецепта</h2>
        {parts.map(({ title, ingredients, description }, index) => {
          const descriptionItems = (description ?? '').split('\n').filter(Boolean);

          return (
            <section key={index}>
              <h3>{title}</h3>

              <section>
                <h4>Ингредиенты</h4>
                <ul>
                  {ingredients.map((ingredient, index) => {
                    return (
                      <li key={index}>
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
