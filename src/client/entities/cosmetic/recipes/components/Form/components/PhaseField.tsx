import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { Form } from '#/ui-lib/components/atoms/Form';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Text } from '#/ui-lib/components/atoms/Text';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { CSS } from '@dnd-kit/utilities';

import { FormPhase, FormIngredient } from '../schema';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { IngredientField } from './IngredientField';
import { createIngredinetId } from '../utils';
import { PhaseData, DraggingData } from '../types';
import { CosmeticIngredientCombobox } from '#/client/entities/cosmetic/ingredients';

export function PhaseField({
  index,
  phase,
  fieldName,
  onRemove,
  draggingData,
}: {
  index: number;
  fieldName: string;
  phase: FormPhase;
  onRemove: () => void;
  draggingData?: DraggingData;
}) {
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({
    id: phase.id,
    data: {
      type: 'PHASE',
      phase,
      fieldName,
      index,
    } satisfies PhaseData,
  });

  const isDragging = draggingData?.type === 'PHASE' && draggingData.phase.id === phase.id;

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? '0.5' : '1',
      }}>
      <Box
        spacing={{ px: 4, py: 4, mb: 4 }}
        color="background"
        borderRadius="m"
        borderWidth="m">
        <Form.FieldArray<FormIngredient> name={`${fieldName}.ingredients`}>
          {({ fields: ingredientFields }) => {
            return (
              <>
                <Flex direction="row" alignItems="center" gap={1} spacing={{ mb: 4 }}>
                  <div {...listeners} {...attributes}>
                    drag
                  </div>

                  <Text variant="header-m">Фаза {index + 1}</Text>

                  <Button view="outlined" onClick={onRemove}>
                    Удалить фазу
                  </Button>

                  <CosmeticIngredientCombobox
                    trigger={<Button type="button">Добавить ингредиент</Button>}
                    onItemClick={ingredient => {
                      ingredientFields.push({
                        id: createIngredinetId(),
                        ingredientId: ingredient.id,
                        percent: 0,
                        comment: '',
                      });
                    }}
                  />
                </Flex>

                <Flex direction="column" gap={4}>
                  <SortableContext
                    items={ingredientFields.map((_, index) => {
                      const ingredient = ingredientFields.value[index];

                      return ingredient.id;
                    })}>
                    {ingredientFields.map((ingFieldName, index) => {
                      const ingredient = ingredientFields.value[index];

                      return (
                        <IngredientField
                          key={ingFieldName}
                          phaseId={phase.id}
                          ingredient={ingredient}
                          fieldName={ingFieldName}
                          draggingData={draggingData}
                          onRemove={() => ingredientFields.remove(index)}
                        />
                      );
                    })}
                  </SortableContext>
                </Flex>
              </>
            );
          }}
        </Form.FieldArray>
      </Box>
    </div>
  );
}
