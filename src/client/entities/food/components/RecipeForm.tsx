import { FoodRecipe, FoodValidators } from '#/shared/models/food';
import { Button } from '#/client/components/Button';
import { FForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { NumberInput } from '#/client/components/NumberInput';
import { TextArea } from '#/client/components/TextArea';
import { TextInput } from '#/client/components/TextInput';
import { FoodProductSearch } from '#/client/entities/food';
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

  if (parts.length === 0) {
    parts.push({
      title: 'Основная',
      description: '-',
      ingredients: [],
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

export function FoodRecipeForm({ onSubmit, recipe }: RecipeFormProps) {
  return (
    <FForm
      schema={FoodRecipeValidator}
      onSubmit={onSubmit}
      initialValues={getInitialValues(recipe)}>
      {({ handleSubmit }) => (
        <>
          <Form.Content>
            <FForm.Field title="Имя" name="name" required>
              {TextInput}
            </FForm.Field>

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
                          renderField={({ name, fields, index }) => {
                            return (
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <FForm.Field name={`${name}.productId`} required>
                                  {props => <FoodProductSearch {...props} />}
                                </FForm.Field>

                                <FForm.Field
                                  name={`${name}.grams`}
                                  title="Граммы"
                                  required>
                                  {NumberInput}
                                </FForm.Field>

                                <FForm.Field
                                  name={`${name}.description`}
                                  title="Описание">
                                  {TextInput}
                                </FForm.Field>

                                <div>
                                  <Button onClick={() => fields.remove(index)}>
                                    Удалить
                                  </Button>
                                </div>
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

            <section>
              <h2>Как готовить</h2>

              <FForm.Field name={`description`} required>
                {TextArea}
              </FForm.Field>
            </section>

            <section>
              <h2>Выход</h2>

              <FForm.Field name={`output.grams`} title="Граммы" required>
                {NumberInput}
              </FForm.Field>
              <FForm.Field name={`output.servings`} title="Порции" required>
                {NumberInput}
              </FForm.Field>
            </section>
          </Form.Content>

          <Form.Footer>
            <Button onClick={handleSubmit}>Сохранить</Button>
          </Form.Footer>
        </>
      )}
    </FForm>
  );
}
