import { FoodProduct } from '#shared/models/FoodProduct';
import {
  FOOD_RECIPE_STATS_TYPES,
  FoodRecipe,
  FoodRecipeStatsType,
  FoodRecipeValidator,
} from '#shared/models/FoodRecipe';
import { FFieldArray } from '#ui/components/forms/FFieldArray';
import { FFNumberInput } from '#ui/components/forms/FFNumberInput';
import { FForm } from '#ui/components/forms/FForm';
import { FFSelect } from '#ui/components/forms/FFSelect';
import { FFTextArea } from '#ui/components/forms/FFTextArea';
import { FFTextInput } from '#ui/components/forms/FFTextInput';
import { z } from 'zod';

type RecipeFormValues = z.infer<typeof FoodRecipeValidator>;

interface RecipeFormProps {
  recipe?: FoodRecipe;
  products: FoodProduct[];
  onSubmit(values: RecipeFormValues): void;
}

function getInitialValues(recipe?: FoodRecipe): RecipeFormValues {
  const stats: RecipeFormValues['stats'] = [];
  const parts: RecipeFormValues['parts'] = [];

  for (const { type, quantity } of recipe?.stats || []) {
    stats.push({ type, quantity });
  }

  for (const part of recipe?.parts || []) {
    parts.push({
      title: part.title,
      description: part.description,
      ingredients: part.ingredients.map(i => ({
        grams: i.grams,
        productId: i.product.id,
        description: i.description,
      })),
    });
  }

  return {
    stats,
    parts,
    description: recipe?.description || '',
    name: recipe?.name || '',
  };
}

export function FoodRecipeForm({ onSubmit, products, recipe }: RecipeFormProps) {
  return (
    <FForm
      schema={FoodRecipeValidator}
      onSubmit={onSubmit}
      initialValues={getInitialValues(recipe)}>
      {({ values }) => (
        <>
          <FFTextInput name="name" title="Имя" required />

          <section>
            <h2>Статистика</h2>
            <FFieldArray<{ type: FoodRecipeStatsType; quantity: number }>
              name="stats"
              newElement={{}}
              renderField={({ name, value }) => {
                return (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <FFSelect
                      name={`${name}.type`}
                      items={FOOD_RECIPE_STATS_TYPES.filter(type => {
                        if (type === value.type) {
                          return true;
                        }

                        const statsWithSameType = values.stats?.find(
                          s => s.type === type,
                        );

                        return !statsWithSameType;
                      })}
                      getTitle={p => p}
                      getValue={p => p}
                      required
                    />
                    <FFNumberInput
                      name={`${name}.quantity`}
                      title="Количество"
                      required
                    />
                  </div>
                );
              }}
            />
          </section>

          <section>
            <h2>Части рецепта</h2>
            <FFieldArray<RecipeFormValues['parts'][number]>
              name="parts"
              addButtonText="Добавить часть рецепта"
              newElement={{
                title: '',
                description: '',
                ingredients: [],
              }}
              renderField={({ name }) => {
                return (
                  <div style={{ marginBottom: '20px' }}>
                    <FFTextInput name={`${name}.title`} title="Название" required />
                    <FFTextArea name={`${name}.description`} title="Подготовка" />
                    <section>
                      <h3>Ингредиенты</h3>
                      <FFieldArray<
                        RecipeFormValues['parts'][number]['ingredients'][number]
                      >
                        name={`${name}.ingredients`}
                        addButtonText="Добавить ингредиент"
                        newElement={{
                          grams: undefined as unknown as number,
                          productId: '',
                        }}
                        renderField={({ name }) => {
                          return (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <FFSelect
                                name={`${name}.productId`}
                                items={products}
                                getTitle={p => p.name}
                                getValue={p => p.id}
                                required
                              />
                              <FFNumberInput
                                name={`${name}.grams`}
                                title="Граммы"
                                required
                              />
                              <FFTextInput
                                name={`${name}.description`}
                                title="Описание"
                              />
                            </div>
                          );
                        }}
                      />
                    </section>
                    <hr />
                  </div>
                );
              }}
            />
          </section>

          <hr style={{ marginTop: '20px', marginBottom: '20px' }} />

          <FFTextArea name={`description`} title="Как готовить" required />
        </>
      )}
    </FForm>
  );
}
