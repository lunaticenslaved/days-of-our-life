import { Flex } from '#/ui-lib/atoms/Flex';
import { WithInputProps } from '#/ui-lib/types';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { rectSwappingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import _ from 'lodash';
import { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSS } from '@dnd-kit/utilities';

export type SortableCloudElementRenderArg = Pick<
  ReturnType<typeof useSortable>,
  'attributes' | 'listeners'
> & {
  id: string;
};

type SortableCloudProps = WithInputProps<
  string[] | undefined,
  {
    renderElement: (arg: SortableCloudElementRenderArg) => ReactNode;
    renderDraggedElement: (arg: Pick<SortableCloudElementRenderArg, 'id'>) => ReactNode;
    append?: ReactNode;
  }
>;

export function SortableCloud({
  value = [],
  onValueUpdate,
  renderElement,
  renderDraggedElement,
  append,
}: SortableCloudProps) {
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
          {value.map(elementId => {
            return (
              <SortableItem key={elementId} id={elementId}>
                {arg => {
                  return renderElement({ ...arg, id: elementId });
                }}
              </SortableItem>
            );
          })}
        </SortableContext>

        {'document' in window &&
          createPortal(
            <DragOverlay>
              {dragIngredientId && renderDraggedElement({ id: dragIngredientId })}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>

      {!!append && <div>{append}</div>}
    </Flex>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (
    prop: Pick<SortableCloudElementRenderArg, 'attributes' | 'listeners'>,
  ) => ReactNode;
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
      {children({ attributes, listeners })}
    </div>
  );
}
