import { FoodRecipe, FoodValidators } from '#/shared/models/food';
import { Button } from '#/ui-lib/atoms/Button/Button';
import { FForm } from '#/client/components/FForm';
import { FoodProductSearch } from '#/client/entities/food';
import { z } from 'zod';
import { TextArea } from '#/ui-lib/atoms/TextArea';
import { NumberInput } from '#/ui-lib/molecules/NumberInput';
import { TextInput } from '#/ui-lib/molecules/TextInput';
import { Box } from '#/ui-lib/atoms/Box';

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
          <Box>
            <FForm.Field title="Имя" name="name" required>
              {fieldProps => {
                return (
                  <TextInput
                    {...fieldProps}
                    value={fieldProps.value}
                    onValueUpdate={fieldProps.onModelValueChange}
                  />
                );
              }}
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
                        {fieldProps => {
                          return (
                            <TextInput
                              {...fieldProps}
                              value={fieldProps.value}
                              onValueUpdate={fieldProps.onModelValueChange}
                            />
                          );
                        }}
                      </FForm.Field>

                      <FForm.Field name={`${name}.description`} title="Подготовка">
                        {fieldProps => {
                          return (
                            <TextArea
                              {...fieldProps}
                              value={fieldProps.modelValue}
                              onValueUpdate={fieldProps.onModelValueChange}
                            />
                          );
                        }}
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
                                  {props => (
                                    <FoodProductSearch
                                      type="single"
                                      {...props}
                                      value={props.modelValue}
                                      onValueUpdate={props.onModelValueChange}
                                    />
                                  )}
                                </FForm.Field>

                                <FForm.Field
                                  name={`${name}.grams`}
                                  title="Граммы"
                                  required>
                                  {fieldProps => {
                                    return (
                                      <NumberInput
                                        {...fieldProps}
                                        value={fieldProps.value}
                                        onValueUpdate={fieldProps.onModelValueChange}
                                      />
                                    );
                                  }}
                                </FForm.Field>

                                <FForm.Field
                                  name={`${name}.description`}
                                  title="Описание">
                                  {fieldProps => {
                                    return (
                                      <TextInput
                                        {...fieldProps}
                                        value={fieldProps.value}
                                        onValueUpdate={fieldProps.onModelValueChange}
                                      />
                                    );
                                  }}
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
                {fieldProps => {
                  return (
                    <TextArea
                      {...fieldProps}
                      value={fieldProps.modelValue}
                      onValueUpdate={fieldProps.onModelValueChange}
                    />
                  );
                }}
              </FForm.Field>
            </section>

            <section>
              <h2>Выход</h2>

              <FForm.Field name={`output.grams`} title="Граммы" required>
                {fieldProps => {
                  return (
                    <NumberInput
                      {...fieldProps}
                      value={fieldProps.value}
                      onValueUpdate={fieldProps.onModelValueChange}
                    />
                  );
                }}
              </FForm.Field>
              <FForm.Field name={`output.servings`} title="Порции" required>
                {fieldProps => {
                  return (
                    <NumberInput
                      {...fieldProps}
                      value={fieldProps.value}
                      onValueUpdate={fieldProps.onModelValueChange}
                    />
                  );
                }}
              </FForm.Field>
            </section>
          </Box>

          <Box>
            <Button onClick={handleSubmit}>Сохранить</Button>
          </Box>
        </>
      )}
    </FForm>
  );
}
