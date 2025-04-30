import { useFoodPageParams } from '#/client/pages/food';
import { Link } from 'react-router-dom';
import { FOOD_NAVIGATION } from '../../index';
import { FoodRecipeOutput, FoodNutrientsList } from '#/client/entities/food';
import { multiplyNutrients } from '#/shared/models/food';
import { useState } from 'react';
import { useGetFoodRecipeQuery } from '#/client/store';
import { Page } from '#/client/widgets/Page';
import { NumberInput } from '#/ui-lib/components/molecules/NumberInput';

export default function FoodRecipeOverviewPage() {
  const { recipeId = '' } = useFoodPageParams();
  const query = useGetFoodRecipeQuery(recipeId);

  const [testGrams, setTestGrams] = useState<number>();

  if (query.isLoading) {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Продукт</Page.Title>
        </Page.Header>

        <Page.Content>
          <Page.Loading />
        </Page.Content>
      </Page>
    );
  }

  const product = query.data;

  if (!product) {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Продукт</Page.Title>
        </Page.Header>

        <Page.Content>
          <Page.Error />
        </Page.Content>
      </Page>
    );
  }

  const { parts, output, nutrientsPerGram, description } = product;
  const gramsPerPortion = output.grams / output.servings;

  return (
    <Page>
      <Page.Header>
        <Page.Title>{product.name}</Page.Title>
        <Page.Actions>
          <Link to={FOOD_NAVIGATION.toRecipeEdit({ recipeId: product.id })}>
            Редактировать
          </Link>
        </Page.Actions>
      </Page.Header>

      <Page.Content>
        <section>
          <h2>Выход</h2>
          <FoodRecipeOutput output={output} />
        </section>

        <section>
          <h2>Питательные вещества</h2>

          <section>
            <h3>На 100 г</h3>
            <NumberInput value={testGrams} onValueUpdate={setTestGrams} />
            {testGrams && (
              <div>
                Проверка калорийности - {testGrams * product.nutrientsPerGram.calories}
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
      </Page.Content>
    </Page>
  );
}
