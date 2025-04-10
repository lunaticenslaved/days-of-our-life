import { getCosmeticINCIIngredientKeywords } from '#/client/entities/cosmetic/inci-indgredients/utils';
import { CosmeticINCIIngredient } from '#/shared/models/cosmetic';
import { Box } from '#/ui-lib/atoms/Box';
import { Button } from '#/ui-lib/atoms/Button';
import { Combobox } from '#/ui-lib/atoms/Combobox';
import { Flex } from '#/ui-lib/atoms/Flex';
import { Text } from '#/ui-lib/atoms/Text';
import { List } from '#/ui-lib/molecules/List';
import { WithInputProps } from '#/ui-lib/types';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { rectSwappingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import _ from 'lodash';
import { ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSS } from '@dnd-kit/utilities';

type INCIIngredientTagSelectProps = WithInputProps<
  string[] | undefined,
  {
    ingredients: CosmeticINCIIngredient[];
  }
>;

export function INCIIngredientTagSelect({
  value = [],
  onValueUpdate,
  ingredients,
}: INCIIngredientTagSelectProps) {
  const ingredientsMap = useMemo(() => {
    return _.fromPairs(
      ingredients.map(ingredient => {
        return [ingredient.id, ingredient];
      }),
    );
  }, [ingredients]);

  const notSelectedIngredients = useMemo(() => {
    return ingredients.filter(ingredient => {
      return !value.includes(ingredient.id);
    });
  }, [ingredients, value]);

  const [dragIngredientId, setDragIngredientId] = useState<string>();

  return (
    <Flex gap={2} flexWrap="wrap">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={event => {
          setDragIngredientId(event.active.id.toString());
        }}
        onDragEnd={event => {
          setDragIngredientId(undefined);

          const activeIndex = value.indexOf(event.active.id.toString());
          const overIndex = event.over ? value.indexOf(event.over.id.toString()) : -1;

          if (activeIndex === -1) {
            return;
          }

          if (overIndex === -1) {
            return;
          }

          const newValue = [...value];

          [newValue[activeIndex], newValue[overIndex]] = [
            newValue[overIndex],
            newValue[activeIndex],
          ];

          onValueUpdate?.(newValue);
        }}>
        <SortableContext items={value} strategy={rectSwappingStrategy}>
          {value.map(ingredientId => {
            const ingredient = ingredientsMap[ingredientId];

            return (
              <Label
                key={ingredientId}
                id={ingredientId}
                onRemove={() => {
                  onValueUpdate?.(value.filter(id => id !== ingredient.id));
                }}>
                {ingredient.name}
              </Label>
            );
          })}
        </SortableContext>

        {'document' in window &&
          createPortal(
            <DragOverlay>
              {dragIngredientId && (
                <Label id={dragIngredientId} onRemove={() => null}>
                  {ingredientsMap[dragIngredientId].name}
                </Label>
              )}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>

      <Combobox>
        <Combobox.Trigger>
          <Button size="s">Добавить +</Button>
        </Combobox.Trigger>

        <Combobox.Content>
          {/* TODO добавить Paper компонент? */}
          <Box color="background">
            <Flex maxHeight="300px" overflow="auto">
              <List>
                <Box spacing={{ px: 4, pt: 4 }}>
                  <List.Search placeholder="Поиск..." />
                </Box>
                <List.Empty>No ingredients found</List.Empty>
                <List.Group>
                  <Box spacing={{ px: 4, pb: 4 }} overflow="auto">
                    {notSelectedIngredients.map(ingredient => {
                      return (
                        <List.Item
                          key={ingredient.id}
                          value={ingredient.id}
                          keywords={getCosmeticINCIIngredientKeywords(ingredient)}
                          onClick={() => {
                            onValueUpdate?.([
                              ...value.filter(id => id !== ingredient.id),
                              ingredient.id,
                            ]);
                          }}>
                          {ingredient.name}
                        </List.Item>
                      );
                    })}
                  </Box>
                </List.Group>
              </List>
            </Flex>
          </Box>
        </Combobox.Content>
      </Combobox>
    </Flex>
  );
}

function Label({
  id,
  children,
  onRemove,
}: {
  id: string;
  children: ReactNode;
  onRemove?: () => void;
}) {
  const { transform, transition, attributes, listeners, setNodeRef } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Box color="background">
        <Flex gap={2} alignItems="center">
          <div style={{ cursor: 'pointer' }} {...attributes} {...listeners}>
            grag
          </div>

          <Text wordWrap="unset" minWidth="max-content">
            {children}
          </Text>

          {!!onRemove && (
            <Button view="clear" size="s" onClick={onRemove}>
              x
            </Button>
          )}
        </Flex>
      </Box>
    </div>
  );
}
