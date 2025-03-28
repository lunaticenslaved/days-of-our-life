import { Button } from '#/ui-lib/atoms/Button';
import {
  CosmeticIngredient,
  CosmeticRecipe,
  CosmeticRecipeValidators,
} from '#/shared/models/cosmetic';
import { ERROR_MESSAGES } from '#/shared/validation';
import { ReactNode, useMemo } from 'react';
import { z } from 'zod';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { Box } from '#/ui-lib/atoms/Box';
import { Text } from '#/ui-lib/atoms/Text';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { Flex } from '#/ui-lib/atoms/Flex';
import { CosmeticIngredientSingleSelect } from '#/client/entities/cosmetic/ingredients';
import { NumberInput } from '#/ui-lib/molecules/NumberInputField';
import { sumBy, uniqueId } from 'lodash';
import { TextArea } from '#/ui-lib/atoms/TextArea';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';

const schema = z.object({
  name: CosmeticRecipeValidators.name,
  description: CosmeticRecipeValidators.description,
  phases: z
    .array(
      z.object({
        id: z.string(),
        ingredients: z
          .array(
            z.object({
              id: z.string(),
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

type FormValues = z.infer<typeof schema>;

function getInitialValues(recipe?: CosmeticRecipe): FormValues {
  return {
    name: recipe?.name || '',
    description: recipe?.description || '',
    phases: recipe
      ? recipe.phases.map(phase => {
          return {
            id: uniqueId(),
            ingredients: phase.ingredients.map(ingredient => ({
              id: uniqueId(),
              ...ingredient,
            })),
          };
        })
      : [
          {
            id: uniqueId(),
            ingredients: [
              {
                id: uniqueId(),
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
  onSubmit(values: FormValues): void;
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
      {({ handleSubmit, values, form }) => {
        const onDragEnd: OnDragEndResponder = ({ source, destination }) => {
          if (!destination) {
            return;
          }

          // Handle dragging ingredients
          if (
            source.droppableId.startsWith('phase-') &&
            destination.droppableId.startsWith('phase-')
          ) {
            const sourcePhaseId = source.droppableId.split('-')[1];
            const destinationPhaseId = destination.droppableId.split('-')[1];

            if (sourcePhaseId !== destinationPhaseId) {
              // FIXME
              throw new Error('Cannot handle that');
            } else {
              form.change(
                `phases`,
                values.phases.map(phase => {
                  if (phase.id === sourcePhaseId) {
                    const ingredients = [...phase.ingredients];

                    [ingredients[source.index], ingredients[destination.index]] = [
                      ingredients[destination.index],
                      ingredients[source.index],
                    ];

                    return {
                      ...phase,
                      ingredients,
                    };
                  } else {
                    return phase;
                  }
                }),
              );
            }
          } else {
            // TODO does it happen?
            return;
          }
        };

        return (
          <Flex direction="column" gap={4}>
            <Form.Field<FormValues['name'] | undefined> name={'name'} required>
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

            <Form.Field<FormValues['description'] | undefined>
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
              <Flex spacing={{ mb: 2 }}>
                <Text variant="header-m">Фазы</Text>
              </Flex>

              <DragDropContext onDragEnd={onDragEnd}>
                <Form.FieldArray<FormValues['phases'][number]> name="phases">
                  {({ fields: phasesPields }) => {
                    return (
                      <Flex direction="column" gap={4}>
                        <Flex direction="column" gap={2}>
                          {phasesPields.map((phaseFieldName, phaseIndex) => {
                            const phase = values.phases[phaseIndex];

                            return (
                              <Box key={phaseFieldName} spacing={{ mb: 4 }}>
                                <Flex
                                  direction="row"
                                  alignItems="center"
                                  gap={1}
                                  spacing={{ mb: 4 }}>
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
                                  FormValues['phases'][number]['ingredients'][number]
                                >
                                  name={`${phaseFieldName}.ingredients`}>
                                  {({ fields: ingredientFields }) => {
                                    return (
                                      <Flex direction="column" gap={4}>
                                        <Droppable droppableId={`phase-${phase.id}`}>
                                          {provided => {
                                            return (
                                              <Flex
                                                ref={provided.innerRef}
                                                direction="column"
                                                gap={2}
                                                {...provided.droppableProps}>
                                                {ingredientFields.map(
                                                  (
                                                    ingredientField,
                                                    ingredientFieldIndex,
                                                  ) => {
                                                    const ingredient =
                                                      phase.ingredients[
                                                        ingredientFieldIndex
                                                      ];

                                                    return (
                                                      <Draggable
                                                        key={ingredient.id}
                                                        draggableId={ingredient.id}
                                                        index={ingredientFieldIndex}>
                                                        {provided => (
                                                          <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}>
                                                            <IngredientField
                                                              name={ingredientField}
                                                              ingredients={ingredients}
                                                              onRemove={() =>
                                                                ingredientFields.remove(
                                                                  ingredientFieldIndex,
                                                                )
                                                              }
                                                              dragHandler={
                                                                <div
                                                                  {...provided.dragHandleProps}>
                                                                  drag
                                                                </div>
                                                              }
                                                            />
                                                          </div>
                                                        )}
                                                      </Draggable>
                                                    );
                                                  },
                                                )}

                                                {provided.placeholder}
                                              </Flex>
                                            );
                                          }}
                                        </Droppable>

                                        <Button
                                          type="button"
                                          onClick={() => {
                                            ingredientFields.push({
                                              id: uniqueId(),
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
                              id: uniqueId(),
                              ingredients: [],
                            });
                          }}>
                          Добавить фазу
                        </Button>
                      </Flex>
                    );
                  }}
                </Form.FieldArray>
              </DragDropContext>
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

// TODO use card here?
function IngredientField({
  name,
  ingredients,
  onRemove,
  dragHandler,
}: {
  name: string;
  ingredients: CosmeticIngredient[];
  onRemove: () => void;
  dragHandler: ReactNode;
}) {
  return (
    <Box color="background" borderRadius="m" borderWidth="m" spacing={{ px: 4, pt: 4 }}>
      <Flex gap={1} alignItems="center">
        {dragHandler}

        <Form.Field required name={`${name}.ingredientId`}>
          {fieldProps => {
            return (
              <Field>
                <Field.Label>Ингредиент</Field.Label>
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

        <Form.Field<number | undefined> name={`${name}.percent`} required>
          {fieldProps => {
            return (
              <Field>
                <Field.Label>Процент</Field.Label>
                <Field.Input>
                  <NumberInput {...fieldProps.input} />
                </Field.Input>
                <Field.Message />
              </Field>
            );
          }}
        </Form.Field>

        <Form.Field<string | undefined> name={`${name}.comment`} required>
          {fieldProps => {
            return (
              <Field>
                <Field.Label>Комментарий</Field.Label>
                <Field.Input>
                  <TextInput {...fieldProps.input} />
                </Field.Input>
                <Field.Message />
              </Field>
            );
          }}
        </Form.Field>

        <Button type="button" view="outlined" onClick={onRemove}>
          Удалить
        </Button>
      </Flex>
    </Box>
  );
}
