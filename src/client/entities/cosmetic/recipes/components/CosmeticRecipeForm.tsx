import { Button } from '#/client/components/Button';
import { FinalForm } from '#/client/components/FForm';
import { Form } from '#/client/components/Form';
import { NumberInput } from '#/client/components/NumberInput';
import { TextArea } from '#/client/components/TextArea';
import { TextInput } from '#/client/components/TextInput';
import { CosmeticIngredientSingleSelect } from '#/client/entities/cosmetic/ingredients/components/CosmeticIngredientSelect';
import {
  CosmeticIngredient,
  CosmeticRecipe,
  CosmeticRecipeValidators,
} from '#/shared/models/cosmetic';
import { ERROR_MESSAGES } from '#/shared/validation';
import { useMemo } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: CosmeticRecipeValidators.name,
  description: CosmeticRecipeValidators.description,
  phases: z
    .array(
      z.object({
        name: CosmeticRecipeValidators.phaseName,
        ingredients: z
          .array(
            z.object({
              ingredientId: CosmeticRecipeValidators.ingredientId,
              percent: CosmeticRecipeValidators.ingredientPercent,
              comment: CosmeticRecipeValidators.ingredientComment,
            }),
          )
          .min(1, ERROR_MESSAGES.required),
      }),
    )
    .min(1, ERROR_MESSAGES.required)
    .refine(
      phases => {
        let sum = 0;

        for (const phase of phases) {
          for (const ingredient of phase.ingredients) {
            sum += ingredient?.percent || 0;
          }
        }

        return sum === 100;
      },
      {
        message: 'Сумма всех ингредиентов должна быть равна 100%',
      },
    ),
});

type CosmeticRecipeFormValues = z.infer<typeof schema>;

function getInitialValues(recipe?: CosmeticRecipe): CosmeticRecipeFormValues {
  return {
    name: recipe?.name || '',
    description: recipe?.description || '',
    phases: recipe
      ? recipe.phases.map(phase => {
          return {
            name: phase.name,
            ingredients: phase.ingredients.map(ingredient => ({ ...ingredient })),
          };
        })
      : [
          {
            name: 'Фаза A',
            ingredients: [
              {
                ingredientId: '',
                percent: null as unknown as number,
                comment: '',
              },
            ],
          },
        ],
  };
}

interface CosmeticRecipeFormProps {
  recipe?: CosmeticRecipe;
  onSubmit(values: CosmeticRecipeFormValues): void;
  ingredients: CosmeticIngredient[];
}

export function CosmeticRecipeForm({
  recipe,
  onSubmit,
  ingredients,
}: CosmeticRecipeFormProps) {
  const initialValues = useMemo(() => getInitialValues(recipe), [recipe]);

  return (
    <FinalForm schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <Form.Content>
            <FinalForm.Field title="Имя" name="name" required>
              {TextInput}
            </FinalForm.Field>

            <FinalForm.Field title="Описание" name="description">
              {TextArea}
            </FinalForm.Field>

            <section>
              <h2>Фазы</h2>
              <FinalForm.FieldArray<CosmeticRecipeFormValues['phases'][number]>
                name="phases"
                addButtonText="Добавить фазу"
                newElement={{
                  name: '',
                  ingredients: [
                    {
                      ingredientId: '',
                      comment: '',
                      percent: null as unknown as number,
                    },
                  ],
                }}
                renderField={({ name, fields, index }) => {
                  return (
                    <div style={{ marginBottom: '20px' }}>
                      <Button
                        onClick={() => {
                          fields.remove(index);
                        }}>
                        Удалить фазу
                      </Button>

                      <FinalForm.Field name={`${name}.name`} title="Название" required>
                        {fieldProps => {
                          return <TextInput {...fieldProps} />;
                        }}
                      </FinalForm.Field>

                      <FinalForm.FieldArray<
                        CosmeticRecipeFormValues['phases'][number]['ingredients'][number]
                      >
                        name={`${name}.ingredients`}
                        addButtonText="Добавить ингредиент"
                        newElement={{}}
                        renderField={({ name: ingredientName }) => {
                          return (
                            <div style={{ marginBottom: '20px', display: 'flex' }}>
                              <FinalForm.Field
                                required
                                name={`${ingredientName}.ingredientId`}
                                title="Ингредиент">
                                {fieldProps => {
                                  return (
                                    <CosmeticIngredientSingleSelect
                                      {...fieldProps}
                                      entities={ingredients}
                                    />
                                  );
                                }}
                              </FinalForm.Field>

                              <FinalForm.Field
                                name={`${ingredientName}.percent`}
                                title="Процент ввода"
                                required>
                                {NumberInput}
                              </FinalForm.Field>

                              <FinalForm.Field
                                name={`${ingredientName}.comment`}
                                title="Комментарий">
                                {TextInput}
                              </FinalForm.Field>
                            </div>
                          );
                        }}
                      />
                    </div>
                  );
                }}
              />
            </section>
          </Form.Content>

          <Form.Footer>
            {() => {
              return (
                <Button type="submit" onClick={handleSubmit}>
                  Сохранить
                </Button>
              );
            }}
          </Form.Footer>
        </Form>
      )}
    </FinalForm>
  );
}
