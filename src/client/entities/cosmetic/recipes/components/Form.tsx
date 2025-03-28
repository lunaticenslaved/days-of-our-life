import { Button } from '#/ui-lib/atoms/Button';
import {
  CosmeticIngredient,
  CosmeticRecipe,
  CosmeticRecipeValidators,
} from '#/shared/models/cosmetic';
import { ERROR_MESSAGES } from '#/shared/validation';
import { useMemo } from 'react';
import { z } from 'zod';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { Box } from '#/ui-lib/atoms/Box';
import { Text } from '#/ui-lib/atoms/Text';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { Flex } from '#/ui-lib/atoms/Flex';
import { CosmeticIngredientSingleSelect } from '#/client/entities/cosmetic/ingredients';
import { NumberInput } from '#/ui-lib/molecules/NumberInputField';
import { sumBy } from 'lodash';
import { TextArea } from '#/ui-lib/atoms/TextArea';

const schema = z.object({
  name: CosmeticRecipeValidators.name,
  description: CosmeticRecipeValidators.description,
  phases: z
    .array(
      z.object({
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
    .min(1, ERROR_MESSAGES.required),
  // .refine(
  //   phases => {
  //     let sum = 0;

  //     for (const phase of phases) {
  //       for (const ingredient of phase.ingredients) {
  //         sum += ingredient?.percent || 0;
  //       }
  //     }

  //     return sum === 100;
  //   },
  //   {
  //     message: 'Сумма всех ингредиентов должна быть равна 100%',
  //   },
  // ),
});

type CosmeticRecipeFormValues = z.infer<typeof schema>;

function getInitialValues(recipe?: CosmeticRecipe): CosmeticRecipeFormValues {
  return {
    name: recipe?.name || '',
    description: recipe?.description || '',
    phases: recipe
      ? recipe.phases.map(phase => {
          return {
            ingredients: phase.ingredients.map(ingredient => ({ ...ingredient })),
          };
        })
      : [
          {
            ingredients: [
              {
                ingredientId: '',
                percent: null as unknown as number,
                comment: null,
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
    <Form schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit, values }) => {
        return (
          <Flex direction="column" gap={4}>
            <Form.Field<CosmeticRecipeFormValues['name'] | undefined>
              name={'name'}
              required>
              {fieldProps => {
                return (
                  <Field>
                    <Field.Label>Название</Field.Label>
                    <Field.Input>
                      <TextInput {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Form.Field<CosmeticRecipeFormValues['description'] | undefined>
              name={'description'}
              required>
              {fieldProps => {
                return (
                  <Field>
                    <Field.Label>Описание</Field.Label>
                    <Field.Input>
                      <TextArea
                        {...fieldProps.input}
                        value={fieldProps.input.value || undefined}
                      />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>

            <Box component="section">
              {/* FIXME use Text */}
              <h3>Фазы</h3>

              <Form.FieldArray<CosmeticRecipeFormValues['phases'][number]> name="phases">
                {({ fields: phasesPields }) => {
                  return (
                    <Flex direction="column" gap={4}>
                      <Flex direction="column" gap={2}>
                        {phasesPields.map((phaseFieldName, phaseIndex) => {
                          return (
                            <Box key={phaseFieldName} spacing={{ mb: 4 }}>
                              <Flex direction="row" alignItems="center" gap={1}>
                                <Text variant="header-m">Фаза {phaseIndex + 1}</Text>

                                <Button
                                  view="outlined"
                                  onClick={() => {
                                    phasesPields.remove(phaseIndex);
                                  }}>
                                  Удалить фазу
                                </Button>
                              </Flex>

                              <Form.FieldArray<
                                CosmeticRecipeFormValues['phases'][number]['ingredients'][number]
                              >
                                name={`${phaseFieldName}.ingredients`}>
                                {({ fields: ingredientFields }) => {
                                  return (
                                    <Flex direction="column" gap={2}>
                                      {ingredientFields.map(
                                        (ingredientField, ingredientFieldIndex) => {
                                          return (
                                            <Flex gap={1} key={ingredientField}>
                                              <Form.Field
                                                required
                                                name={`${ingredientField}.ingredientId`}>
                                                {fieldProps => {
                                                  return (
                                                    <Field>
                                                      <Field.Label>
                                                        Ингредиент
                                                      </Field.Label>
                                                      <Field.Input>
                                                        <CosmeticIngredientSingleSelect
                                                          {...fieldProps.input}
                                                          entities={ingredients}
                                                        />
                                                      </Field.Input>
                                                      <Field.Message />
                                                    </Field>
                                                  );
                                                }}
                                              </Form.Field>

                                              <Form.Field<number | undefined>
                                                name={`${ingredientField}.percent`}
                                                required>
                                                {fieldProps => {
                                                  return (
                                                    <Field>
                                                      <Field.Label>Процент</Field.Label>
                                                      <Field.Input>
                                                        <NumberInput
                                                          {...fieldProps.input}
                                                        />
                                                      </Field.Input>
                                                      <Field.Message />
                                                    </Field>
                                                  );
                                                }}
                                              </Form.Field>

                                              <Form.Field<string | undefined>
                                                name={`${phaseFieldName}.comment`}
                                                required>
                                                {fieldProps => {
                                                  return (
                                                    <Field>
                                                      <Field.Label>
                                                        Комментарий
                                                      </Field.Label>
                                                      <Field.Input>
                                                        <TextInput
                                                          {...fieldProps.input}
                                                        />
                                                      </Field.Input>
                                                      <Field.Message />
                                                    </Field>
                                                  );
                                                }}
                                              </Form.Field>

                                              <Button
                                                type="button"
                                                view="outlined"
                                                onClick={() =>
                                                  ingredientFields.remove(
                                                    ingredientFieldIndex,
                                                  )
                                                }>
                                                Удалить
                                              </Button>
                                            </Flex>
                                          );
                                        },
                                      )}

                                      <Button
                                        type="button"
                                        onClick={() => {
                                          ingredientFields.push({
                                            ingredientId: '',
                                            percent: 0,
                                            comment: '',
                                          });
                                        }}>
                                        Добавить ингредиент
                                      </Button>
                                    </Flex>
                                  );
                                }}
                              </Form.FieldArray>
                            </Box>
                          );
                        })}
                      </Flex>

                      <Button
                        type="button"
                        onClick={() => {
                          phasesPields.push({
                            ingredients: [],
                          });
                        }}>
                        Добавить фазу
                      </Button>
                    </Flex>
                  );
                }}
              </Form.FieldArray>
            </Box>

            <Flex alignItems="center" gap={2}>
              <Button type="submit" onClick={handleSubmit}>
                Сохранить
              </Button>

              <Text>
                Сумма процентов:{' '}
                {sumBy(values.phases, phase =>
                  sumBy(phase.ingredients, ingredient => ingredient.percent),
                )}
              </Text>
            </Flex>
          </Flex>
        );
      }}
    </Form>
  );
}
