import { Button } from '#/ui-lib/atoms/Button';
import { CosmeticIngredient } from '#/shared/models/cosmetic';
import { Form } from '#/ui-lib/atoms/Form';
import { Field } from '#/ui-lib/atoms/Field';
import { Box } from '#/ui-lib/atoms/Box';
import { TextInput } from '#/ui-lib/molecules/TextInputField';
import { Flex } from '#/ui-lib/atoms/Flex';
import { CosmeticIngredientSingleSelect } from '#/client/entities/cosmetic/ingredients';
import { NumberInput } from '#/ui-lib/molecules/NumberInputField';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FormIngredient } from '../schema';
import { DraggingData, IngredientData } from '../types';

// TODO use card here?
export function IngredientField({
  phaseId,
  ingredient,
  fieldName,
  ingredients,
  onRemove,
  draggingData,
}: {
  phaseId: string;
  ingredient: FormIngredient;
  fieldName: string;
  ingredients: CosmeticIngredient[];
  onRemove: () => void;
  draggingData?: DraggingData;
}) {
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({
    id: ingredient.id,
    data: {
      type: 'INGREDIENT',
      ingredient,
      fieldName,
      phaseId,
    } satisfies IngredientData,
  });

  const isDragging =
    draggingData?.type === 'INGREDIENT' && draggingData.ingredient.id === ingredient.id;

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? '0.5' : '1',
      }}>
      <Box color="background" borderRadius="m" borderWidth="m" spacing={{ px: 4, pt: 4 }}>
        <Flex gap={1} alignItems="center">
          <div {...listeners} {...attributes}>
            drag
          </div>

          <Form.Field required name={`${fieldName}.ingredientId`}>
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

          <Form.Field<number | undefined> name={`${fieldName}.percent`} required>
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

          <Form.Field<string | undefined> name={`${fieldName}.comment`} required>
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
    </div>
  );
}
