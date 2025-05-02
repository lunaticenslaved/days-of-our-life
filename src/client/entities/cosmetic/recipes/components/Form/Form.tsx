import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { CosmeticRecipe } from '#/shared/models/cosmetic';
import { useMemo, useState } from 'react';
import { Form } from '#/ui-lib/components/atoms/Form';
import { Field } from '#/ui-lib/components/atoms/Field';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Text } from '#/ui-lib/components/atoms/Text';
import { TextInput } from '#/ui-lib/components/molecules/TextInput';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { sumBy, uniqueId } from 'lodash';
import { TextArea } from '#/ui-lib/components/atoms/TextArea';

import { IngredientField } from './components/IngredientField';
import { PhaseField } from './components/PhaseField';
import { FormValues, schema } from './schema';
import { DraggingData } from './types';
import { INGREDIENT_DRAGGABLE, PHASE_DRAGGABLE } from './constants';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import {
  createIngredinetId,
  createPhaseId,
} from '#/client/entities/cosmetic/recipes/components/Form/utils';
import { nonReachable } from '#/shared/utils';

function getInitialValues(recipe?: CosmeticRecipe): FormValues {
  return {
    name: recipe?.name || '',
    description: recipe?.description || '',
    phases: recipe
      ? recipe.phases.map(phase => {
          return {
            id: createPhaseId(),
            ingredients: phase.ingredients.map(ingredient => ({
              id: uniqueId(),
              ...ingredient,
            })),
          };
        })
      : [
          {
            id: createPhaseId(),
            ingredients: [
              {
                id: createIngredinetId(),
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
}

export function CosmeticRecipeForm({ recipe, onSubmit }: CosmeticRecipeFormProps) {
  const initialValues = useMemo(() => getInitialValues(recipe), [recipe]);

  const [activeData, setActiveDate] = useState<DraggingData>();

  return (
    <Form schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit, values, form }) => {
        const onDragEnd = (event: DragEndEvent) => {
          const { active, over } = event;

          if (!active || !over) {
            return;
          }

          const overCurrent = over.data.current as DraggingData | null;
          const activeCurrent = active.data.current as DraggingData | null;

          if (!overCurrent || !activeCurrent) {
            return;
          }

          if (overCurrent.type === 'INGREDIENT' && activeCurrent.type === 'INGREDIENT') {
            if (overCurrent.phaseId === activeCurrent.phaseId) {
              const newPhases = values.phases.map(phase => {
                if (phase.id !== overCurrent.phaseId) {
                  return phase;
                }

                const ingredients = phase.ingredients.map(ingredient => {
                  if (ingredient.id === overCurrent.ingredient.id) {
                    return activeCurrent.ingredient;
                  } else if (ingredient.id === activeCurrent.ingredient.id) {
                    return overCurrent.ingredient;
                  }

                  return ingredient;
                });

                return {
                  ...phase,
                  ingredients,
                };
              });

              form.change('phases', newPhases);
            } else {
              const newPhases = values.phases.map(phase => {
                if (phase.id === activeCurrent.phaseId) {
                  return {
                    ...phase,
                    ingredients: phase.ingredients.filter(
                      ingredient => ingredient.id !== activeCurrent.ingredient.id,
                    ),
                  };
                } else if (phase.id === overCurrent.phaseId) {
                  return {
                    ...phase,
                    ingredients: [...phase.ingredients, activeCurrent.ingredient],
                  };
                }

                return phase;
              });

              form.change('phases', newPhases);
            }
          } else if (overCurrent.type === 'PHASE' && activeCurrent.type === 'PHASE') {
            const newPhases = [...values.phases];

            [newPhases[overCurrent.index], newPhases[activeCurrent.index]] = [
              newPhases[activeCurrent.index],
              newPhases[overCurrent.index],
            ];

            form.change('phases', newPhases);
          } else if (
            activeCurrent.type === 'INGREDIENT' &&
            overCurrent.type === 'PHASE'
          ) {
            if (activeCurrent.phaseId === overCurrent.phase.id) {
              return;
            }

            const newPhases = values.phases.map(phase => {
              if (phase.id === activeCurrent.phaseId) {
                return {
                  ...phase,
                  ingredients: phase.ingredients.filter(ingredient => {
                    return ingredient.id !== activeCurrent.ingredient.id;
                  }),
                };
              } else if (phase.id === overCurrent.phase.id) {
                return {
                  ...phase,
                  ingredients: [...phase.ingredients, activeCurrent.ingredient],
                };
              }

              return phase;
            });

            form.change('phases', newPhases);
          } else if (
            activeCurrent.type === 'PHASE' &&
            overCurrent.type === 'INGREDIENT'
          ) {
            // TODO ???
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

              <DndContext
                onDragEnd={event => {
                  onDragEnd(event);
                  setActiveDate(undefined);
                }}
                onDragStart={event => {
                  const data = event.active.data.current as DraggingData | null;

                  if (!data) {
                    return;
                  }

                  if (data.type === INGREDIENT_DRAGGABLE) {
                    setActiveDate(data);
                  } else if (data.type === PHASE_DRAGGABLE) {
                    setActiveDate(data);
                  } else {
                    nonReachable(data);
                  }
                }}
                modifiers={[restrictToVerticalAxis]}>
                <Form.FieldArray<FormValues['phases'][number]> name="phases">
                  {({ fields: phasesFields }) => {
                    return (
                      <>
                        <SortableContext
                          items={phasesFields.map((_, index) => {
                            const phase = phasesFields.value[index];

                            return phase.id;
                          })}
                          strategy={verticalListSortingStrategy}>
                          {phasesFields.map((fieldName, index) => {
                            const phase = phasesFields.value[index];

                            return (
                              <PhaseField
                                key={phase.id}
                                index={index}
                                fieldName={fieldName}
                                draggingData={activeData}
                                phase={phase}
                                onRemove={() => {
                                  phasesFields.remove(index);
                                }}
                              />
                            );
                          })}
                        </SortableContext>

                        <Button
                          type="button"
                          onClick={() => {
                            phasesFields.push({
                              id: createPhaseId(),
                              ingredients: [],
                            });
                          }}>
                          Добавить фазу
                        </Button>
                      </>
                    );
                  }}
                </Form.FieldArray>

                {'document' in window &&
                  createPortal(
                    <DragOverlay>
                      {activeData?.type === 'INGREDIENT' && (
                        <IngredientField
                          phaseId={activeData.phaseId}
                          ingredient={activeData.ingredient}
                          fieldName={activeData.fieldName}
                          onRemove={() => null}
                          draggingData={activeData}
                        />
                      )}
                      {activeData?.type === 'PHASE' && (
                        <PhaseField
                          index={activeData.index}
                          fieldName={activeData.fieldName}
                          phase={activeData.phase}
                          onRemove={() => null}
                        />
                      )}
                    </DragOverlay>,
                    document.body,
                  )}
              </DndContext>
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
