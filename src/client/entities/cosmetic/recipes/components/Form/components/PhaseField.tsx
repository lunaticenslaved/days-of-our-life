import { Button } from '#/ui-lib/atoms/Button';
import { Form } from '#/ui-lib/atoms/Form';
import { Box } from '#/ui-lib/atoms/Box';
import { Text } from '#/ui-lib/atoms/Text';
import { Flex } from '#/ui-lib/atoms/Flex';
import { CSS } from '@dnd-kit/utilities';

import { FormPhase, FormIngredient } from '../schema';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { IngredientField } from './IngredientField';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { createIngredinetId } from '../utils';
import { PhaseData, DraggingData } from '../types';
import { CosmeticIngredientCombobox } from '#/client/entities/cosmetic/ingredients';

export function PhaseField({
  index,
  phase,
  fieldName,
  onRemove,
  ingredients,
  draggingData,
}: {
  index: number;
  fieldName: string;
  phase: FormPhase;
  onRemove: () => void;
  ingredients: CosmeticIngredient[];
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
                    ingredients={ingredients}
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
                          key={ingredient.id}
                          phaseId={phase.id}
                          ingredient={ingredient}
                          fieldName={ingFieldName}
                          ingredients={ingredients}
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
