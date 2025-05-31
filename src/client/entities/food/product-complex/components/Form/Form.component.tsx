import { FoodRecipeCombobox } from '#/client/entities/food/recipes';
import { FoodRecipe } from '#/shared/models/food';
import {
  Button,
  Field,
  Flex,
  Form,
  NumberInput,
  Text,
  TextArea,
  TextInput,
} from '#/ui-lib/components';
import { ReactNode } from 'react';

import { FormErrors, FormValues } from './types';

type LocalFoodRecipe = Pick<FoodRecipe, 'id' | 'name'>;

interface FormComponentProps {
  validate: (values: FormValues) => Promise<FormErrors>;

  isSubmitting: boolean;
  onSubmit: (values: FormValues) => void;

  recipes: LocalFoodRecipe[];
  isFetchingRecipes: boolean;
}

export function FormComponent({
  onSubmit,
  validate,
  recipes,
  isFetchingRecipes,
  isSubmitting,
}: FormComponentProps) {
  const disabled = isSubmitting;

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      disabled={disabled}
      validate={validate}
      initialValues={{
        title: '',
        output: {
          grams: null as unknown as number,
        },
        products: [],
      }}>
      {({ form }) => {
        return (
          <Flex direction="column">
            <Form.Field name="title">
              {fieldProps => {
                return (
                  <Field {...fieldProps.field}>
                    <Field.Input>
                      <TextInput {...fieldProps.input} label="Название" required />
                    </Field.Input>
                    <Field.Message></Field.Message>
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field name="description">
              {fieldProps => {
                return (
                  <Field {...fieldProps.field}>
                    <Field.Input>
                      <TextArea {...fieldProps.input} label="Описание" />
                    </Field.Input>
                    <Field.Message></Field.Message>
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field name="output.grams">
              {fieldProps => {
                return (
                  <Field {...fieldProps.field}>
                    <Field.Input>
                      <NumberInput {...fieldProps.input} required label="Граммы" />
                    </Field.Input>
                    <Field.Message></Field.Message>
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field<string | undefined> name="recipeId">
              {fieldProps => {
                let content: ReactNode = null;

                if (fieldProps.input.value) {
                  const recipe = recipes.find(res => res.id === fieldProps.input.value);

                  if (recipe) {
                    content = (
                      <Flex alignItems="center" gap={2}>
                        <Text>{recipe.name}</Text>
                        <Button
                          view="toned"
                          disabled={disabled}
                          onClick={() => {
                            form.change('recipeId', undefined);
                          }}>
                          Отвязать рецепт
                        </Button>
                      </Flex>
                    );
                  }
                }

                if (!content) {
                  content = (
                    <FoodRecipeCombobox
                      {...fieldProps.input}
                      trigger={
                        <Button
                          view="toned"
                          loading={isFetchingRecipes}
                          disabled={disabled}>
                          + Привязать рецепт
                        </Button>
                      }
                      value={
                        fieldProps.input.value ? [fieldProps.input.value] : undefined
                      }
                      onValueUpdate={newValue => {
                        fieldProps.input.onValueUpdate(newValue?.[0]);
                      }}
                      recipes={recipes}
                      isFetching={isFetchingRecipes}
                      closeOnValueUpdate
                    />
                  );
                }

                return (
                  <Field {...fieldProps.field}>
                    <Field.Input>{content}</Field.Input>
                    <Field.Message></Field.Message>
                  </Field>
                );
              }}
            </Form.Field>

            <Flex>
              <Button type="submit" loading={isSubmitting} disabled={disabled}>
                Сохранить
              </Button>
            </Flex>
          </Flex>
        );
      }}
    </Form>
  );
}
