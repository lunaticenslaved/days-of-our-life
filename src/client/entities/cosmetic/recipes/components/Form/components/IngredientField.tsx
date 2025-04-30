import { Button } from '#/ui-lib/components/atoms/Button/Button';
import { Form } from '#/ui-lib/components/atoms/Form';
import { Field } from '#/ui-lib/components/atoms/Field';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Text } from '#/ui-lib/components/atoms/Text';
import { TextInput } from '#/ui-lib/components/molecules/TextInput';
import { Flex } from '#/ui-lib/components/atoms/Flex';
import { CosmeticIngredientCombobox } from '#/client/entities/cosmetic/ingredients';
import { NumberInput } from '#/ui-lib/components/molecules/NumberInput';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FormIngredient } from '../schema';
import { DraggingData, IngredientData } from '../types';
import { useCosmeticCacheStrict } from '#/client/entities/cosmetic/cache';
import { PiPencil } from 'react-icons/pi';

// TODO use card here?
export function IngredientField({
  phaseId,
  ingredient,
  fieldName,
  onRemove,
  draggingData,
}: {
  phaseId: string;
  ingredient: FormIngredient;
  fieldName: string;
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

  const cache = useCosmeticCacheStrict();

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

          <Box flexGrow={1}>
            <Form.Field required name={`${fieldName}.ingredientId`}>
              {fieldProps => {
                const ingredient = fieldProps.input.value
                  ? cache.ingredients.find(fieldProps.input.value)
                  : undefined;

                return (
                  <Field>
                    <Field.Label>Ингредиент</Field.Label>
                    <Field.Input>
                      <Flex alignItems="center" gap={2}>
                        <Text>{ingredient?.name || '-'}</Text>
                        <CosmeticIngredientCombobox
                          {...fieldProps.input}
                          trigger={
                            <Button view="clear">
                              <PiPencil />
                            </Button>
                          }
                          value={[fieldProps.input.value]}
                          onValueUpdate={values => {
                            fieldProps.input.onValueUpdate(values?.[0]);
                          }}
                        />
                      </Flex>
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>
          </Box>

          <Box minWidth="105px" maxWidth="105px">
            <Form.Field<number | undefined> name={`${fieldName}.percent`} required>
              {fieldProps => {
                return (
                  <Field {...fieldProps.field} required={false}>
                    <Field.Label></Field.Label>
                    <Field.Input>
                      <NumberInput
                        {...fieldProps.input}
                        required
                        hideClear
                        append={'%'}
                      />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>
          </Box>

          <Box minWidth="240px" maxWidth="240px">
            <Form.Field<string | undefined> name={`${fieldName}.comment`}>
              {fieldProps => {
                return (
                  <Field>
                    <Field.Label></Field.Label>
                    <Field.Input>
                      <TextInput {...fieldProps.input} placeholder="Комментарий" />
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            </Form.Field>
          </Box>

          <Button type="button" view="outlined" onClick={onRemove}>
            Удалить
          </Button>
        </Flex>
      </Box>
    </div>
  );
}
