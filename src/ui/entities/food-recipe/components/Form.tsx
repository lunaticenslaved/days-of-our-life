import { FoodProduct, FoodRecipe, FoodValidators } from '#shared/models/food';
import { FForm } from '#ui/components/FForm';
import { NumberInput } from '#ui/components/NumberInput';
import { TextArea } from '#ui/components/TextArea';
import { TextInput } from '#ui/components/TextInput';
import { FoodProductSelect } from '#ui/entities/food-product';
import { z } from 'zod';

export const FoodRecipeValidator = z.object({
  name: FoodValidators.name,
  description: FoodValidators.recipeDescription,
  output: FoodValidators.recipeOutput,
  parts: FoodValidators.recipeParts,
});

type RecipeFormValues = z.infer<typeof FoodRecipeValidator>;

interface RecipeFormProps {
  recipe?: FoodRecipe;
  products: FoodProduct[];
  onSubmit(values: RecipeFormValues): void;
}

function getInitialValues(recipe?: FoodRecipe): RecipeFormValues {
  const parts: RecipeFormValues['parts'] = [];

  for (const part of recipe?.parts || []) {
    parts.push({
      title: part.title,
      description: part.description || '',
      ingredients: part.ingredients.map(i => ({
        grams: i.grams,
        productId: i.product.id,
        description: i.description || '',
      })),
    });
  }

  return {
    parts,
    output: recipe?.output || {
      grams: 0,
      servings: 0,
    },
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
      {() => (
        <>
          <FForm.Field title="Имя" name="name" required>
            {TextInput}
          </FForm.Field>

          <section>
            <h2>Статистика</h2>

            <FForm.Field name={`output.grams`} title="Граммы" converter="number" required>
              {NumberInput}
            </FForm.Field>
            <FForm.Field
              name={`output.servings`}
              title="Порции"
              converter="number"
              required>
              {NumberInput}
            </FForm.Field>
          </section>

          <section>
            <h2>Части рецепта</h2>
            <FForm.FieldArray<RecipeFormValues['parts'][number]>
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
                    <FForm.Field name={`${name}.title`} title="Название" required>
                      {TextInput}
                    </FForm.Field>

                    <FForm.Field name={`${name}.description`} title="Подготовка">
                      {TextArea}
                    </FForm.Field>

                    <section>
                      <h3>Ингредиенты</h3>
                      <FForm.FieldArray<
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
                              <FForm.Field name={`${name}.productId`} required>
                                {props => (
                                  <FoodProductSelect {...props} products={products} />
                                )}
                              </FForm.Field>

                              <FForm.Field
                                name={`${name}.grams`}
                                title="Граммы"
                                converter="number"
                                required>
                                {NumberInput}
                              </FForm.Field>

                              <FForm.Field name={`${name}.description`} title="Описание">
                                {TextInput}
                              </FForm.Field>
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

          <FForm.Field name={`description`} title="Как готовить" required>
            {TextArea}
          </FForm.Field>
        </>
      )}
    </FForm>
  );
}
