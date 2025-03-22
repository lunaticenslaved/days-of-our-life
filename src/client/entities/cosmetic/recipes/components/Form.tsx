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
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { Flex } from '#/ui-lib/atoms/Flex';
import { CosmeticIngredientSingleSelect } from '#/client/entities/cosmetic/ingredients';
import { NumberInput } from '#/ui-lib/molecules/NumberInputField';

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
      {({ handleSubmit }) => {
        return (
          <Flex direction="column" gap={4}>
            <Form.Field<CosmeticRecipeFormValues['name'] | null> name={'name'} required>
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
                                <Form.Field<string | null>
                                  name={`${phaseFieldName}.name`}
                                  required>
                                  {fieldProps => {
                                    return (
                                      <Field direction="horizontal">
                                        <Field.Label>Название</Field.Label>
                                        <Field.Input>
                                          <TextInput {...fieldProps.input} />
                                        </Field.Input>
                                        <Field.Message />
                                      </Field>
                                    );
                                  }}
                                </Form.Field>

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
                                                          modelValue={
                                                            fieldProps.input.value
                                                          }
                                                          onModelValueChange={
                                                            fieldProps.input.onValueUpdate
                                                          }
                                                          entities={ingredients}
                                                        />
                                                      </Field.Input>
                                                      <Field.Message />
                                                    </Field>
                                                  );
                                                }}
                                              </Form.Field>

                                              <Form.Field<number | null>
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

                                              <Form.Field<string | null>
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
                            name: '',
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

            <Button type="submit" onClick={handleSubmit}>
              Сохранить
            </Button>
          </Flex>
        );
      }}
    </Form>
  );
}
