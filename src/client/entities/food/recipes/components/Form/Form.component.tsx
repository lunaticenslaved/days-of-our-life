import { FoodProduct, FoodRecipe } from '#/shared/models/food';
import {
  Form,
  Field,
  Box,
  Button,
  TextInput,
  TextArea,
  NumberInput,
  Flex,
  Popup,
  Text,
} from '#/ui-lib/components';
import { FormValues, schema } from './schema';
import { getInitialValues } from './utils';
import { FoodProductsList } from '#/client/entities/food/products/components/List';
import { useMemo } from 'react';

const MAX_WIDTH = '840px';

interface FormComponentProps {
  recipe?: FoodRecipe;
  onSubmit(values: FormValues): void;
  onFindProduct: (productId: string) => Pick<FoodProduct, 'name'> | undefined;
}

export function FormComponent({ onSubmit, recipe, onFindProduct }: FormComponentProps) {
  const initialValues = useMemo(() => {
    return getInitialValues(recipe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe?.id]);

  return (
    <Form schema={schema} onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit }) => (
        <>
          <Box maxWidth={MAX_WIDTH}>
            <Form.Field name="name" required>
              {fieldProps => {
                return (
                  <Field {...fieldProps.field}>
                    <Field.Label>Название</Field.Label>
                    <Field.Input>
                      <TextInput {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message></Field.Message>
                  </Field>
                );
              }}
            </Form.Field>
          </Box>

          <Flex gap={2} direction="column" width={MAX_WIDTH} maxWidth={MAX_WIDTH}>
            <Text variant="header-xs">Выход</Text>

            <Flex gap={2} minWidth="100%">
              <Box flexGrow={1}>
                <Form.Field name={`output.grams`} required>
                  {fieldProps => {
                    return (
                      <Field>
                        <Field.Input>
                          <NumberInput {...fieldProps.input} append="граммы" />
                        </Field.Input>
                        <Field.Message></Field.Message>
                      </Field>
                    );
                  }}
                </Form.Field>
              </Box>

              <Box flexGrow={1}>
                <Form.Field name={`output.servings`} required>
                  {fieldProps => {
                    return (
                      <Field>
                        <Field.Input>
                          <NumberInput {...fieldProps.input} append="порции" />
                        </Field.Input>
                        <Field.Message></Field.Message>
                      </Field>
                    );
                  }}
                </Form.Field>
              </Box>
            </Flex>
          </Flex>

          <Flex direction="column" gap={2}>
            <Text variant="header-xs">Части рецепта</Text>
            <Form.FieldArray<FormValues['parts'][number]>
              name="parts"
              required
              render={({ fields }) => {
                return (
                  <Field>
                    <Field.Input>
                      <Flex direction="column" gap={2} maxWidth={MAX_WIDTH}>
                        {fields.map((partField, partFieldIndex) => {
                          return (
                            <Flex gap={2}>
                              <Box
                                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                spacing={{ p: 4 }}
                                borderRadius="s"
                                minWidth={MAX_WIDTH}>
                                <Flex key={partField} direction="column" gap={2}>
                                  <Flex gap={2}>
                                    <Box flexGrow={1}>
                                      <Form.Field name={`${partField}.title`} required>
                                        {fieldProps => {
                                          return (
                                            <Field>
                                              <Field.Input>
                                                <TextInput {...fieldProps.input} />
                                              </Field.Input>
                                              <Field.Message></Field.Message>
                                            </Field>
                                          );
                                        }}
                                      </Form.Field>
                                    </Box>
                                  </Flex>

                                  <Flex gap={2} direction="column">
                                    <Form.FieldArray<
                                      FormValues['parts'][number]['ingredients'][number]
                                    >
                                      name={`${partField}.ingredients`}
                                      render={({ fields }) => {
                                        return (
                                          <Field required>
                                            <Field.Input>
                                              <Flex direction="column" gap={2}>
                                                {fields.map(
                                                  (ingredientField, ingredientIndex) => {
                                                    return (
                                                      <Flex
                                                        key={ingredientField}
                                                        gap={2}
                                                        spacing={{ p: 2 }}
                                                        borderRadius="s"
                                                        style={{
                                                          backgroundColor:
                                                            'rgba(255,255,255,0.05)',
                                                        }}>
                                                        <Flex
                                                          alignItems="center"
                                                          minWidth="250px"
                                                          maxWidth="250px"
                                                          flexGrow={1}>
                                                          <Form.Field
                                                            name={`${ingredientField}.productId`}
                                                            required>
                                                            {fieldProps => {
                                                              const product =
                                                                onFindProduct(
                                                                  fieldProps.input.value,
                                                                );

                                                              return (
                                                                <Field
                                                                  {...fieldProps.field}>
                                                                  <Field.Input>
                                                                    <Text>
                                                                      {product?.name ||
                                                                        '-'}
                                                                    </Text>
                                                                  </Field.Input>
                                                                  <Field.Message></Field.Message>
                                                                </Field>
                                                              );
                                                            }}
                                                          </Form.Field>
                                                        </Flex>

                                                        <Box
                                                          minWidth="110px"
                                                          maxWidth="110px">
                                                          <Form.Field
                                                            name={`${ingredientField}.grams`}
                                                            required>
                                                            {fieldProps => {
                                                              return (
                                                                <Field
                                                                  {...fieldProps.field}>
                                                                  <Field.Input>
                                                                    <NumberInput
                                                                      {...fieldProps.input}
                                                                      append="г"
                                                                      required
                                                                    />
                                                                  </Field.Input>
                                                                  <Field.Message></Field.Message>
                                                                </Field>
                                                              );
                                                            }}
                                                          </Form.Field>
                                                        </Box>

                                                        <Box flexGrow={1}>
                                                          <Form.Field
                                                            name={`${ingredientField}.description`}>
                                                            {fieldProps => {
                                                              return (
                                                                <Field
                                                                  {...fieldProps.field}>
                                                                  <Field.Input>
                                                                    <TextInput
                                                                      {...fieldProps.input}
                                                                      placeholder="Комментарий"
                                                                      clearable
                                                                    />
                                                                  </Field.Input>
                                                                  <Field.Message></Field.Message>
                                                                </Field>
                                                              );
                                                            }}
                                                          </Form.Field>
                                                        </Box>

                                                        <Button
                                                          onClick={() =>
                                                            fields.remove(ingredientIndex)
                                                          }>
                                                          Удалить
                                                        </Button>
                                                      </Flex>
                                                    );
                                                  },
                                                )}

                                                <Popup>
                                                  <Popup.Trigger>
                                                    <Button view="toned">
                                                      Добавить ингредиент
                                                    </Button>
                                                  </Popup.Trigger>

                                                  <Popup.Content>
                                                    {popup => {
                                                      return (
                                                        <Box color="background">
                                                          <FoodProductsList
                                                            autoFocus="search"
                                                            onItemClick={product => {
                                                              fields.push({
                                                                productId: product.id,
                                                                grams: 0,
                                                                description: '',
                                                              });
                                                              popup.close();
                                                            }}
                                                          />
                                                        </Box>
                                                      );
                                                    }}
                                                  </Popup.Content>
                                                </Popup>
                                              </Flex>
                                            </Field.Input>
                                            <Field.Message />
                                          </Field>
                                        );
                                      }}
                                    />
                                  </Flex>
                                </Flex>
                              </Box>

                              <Button
                                view="clear"
                                onClick={() => {
                                  fields.remove(partFieldIndex);
                                }}>
                                Удалить
                              </Button>
                            </Flex>
                          );
                        })}

                        <Button
                          onClick={() => {
                            fields.push({
                              title: 'Часть',
                              ingredients: [],
                            });
                          }}>
                          Добавить часть
                        </Button>
                      </Flex>
                    </Field.Input>
                    <Field.Message />
                  </Field>
                );
              }}
            />
          </Flex>

          <Flex direction="column" gap={2} maxWidth={MAX_WIDTH}>
            <Text variant="header-xs">Как готовить</Text>

            <Form.Field name={`description`} required>
              {fieldProps => {
                return (
                  <Field>
                    <Field.Input>
                      <TextArea {...fieldProps.input} />
                    </Field.Input>
                    <Field.Message></Field.Message>
                  </Field>
                );
              }}
            </Form.Field>
          </Flex>

          <Box>
            <Button type="submit" onClick={handleSubmit}>
              Сохранить
            </Button>
          </Box>
        </>
      )}
    </Form>
  );
}
