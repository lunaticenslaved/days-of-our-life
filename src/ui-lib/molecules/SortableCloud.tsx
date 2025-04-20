import { WithInputProps } from '#/ui-lib/types';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import {
  rectSwappingStrategy,
  SortableContext,
  SortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import _ from 'lodash';
import { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSS } from '@dnd-kit/utilities';
import { nonReachable } from '#/shared/utils';

export type SortableCloudElementRenderArg = {
  sortable?: Pick<ReturnType<typeof useSortable>, 'attributes' | 'listeners'>;
  id: string;
};

type SortableCloudProps = WithInputProps<
  string[],
  {
    renderElement: (arg: SortableCloudElementRenderArg) => ReactNode;
    strategy: 'rect-swapping' | 'vertical-list';
  }
>;

export function SortableCloud({
  value = [],
  onValueUpdate,
  renderElement,
  strategy,
}: SortableCloudProps) {
  const [dragElementId, setDragElementId] = useState<string>();

  let sortingStrategy: SortingStrategy | undefined = undefined;

  if (strategy === 'rect-swapping') {
    sortingStrategy = rectSwappingStrategy;
  } else if (strategy === 'vertical-list') {
    sortingStrategy = verticalListSortingStrategy;
  } else {
    nonReachable(strategy);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={event => {
        setDragElementId(event.active.id.toString());
      }}
      onDragEnd={event => {
        setDragElementId(undefined);

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
      <SortableContext items={value} strategy={sortingStrategy}>
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
            {dragElementId && renderElement({ id: dragElementId })}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (prop: Pick<SortableCloudElementRenderArg, 'sortable'>) => ReactNode;
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
      {children({ sortable: { attributes, listeners } })}
    </div>
  );
}
