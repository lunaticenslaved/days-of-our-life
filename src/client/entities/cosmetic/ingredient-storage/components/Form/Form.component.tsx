import { Button, Field, Flex, Form, NumberInput } from '#/ui-lib/components';
import { useMemo } from 'react';

import { schema, FormValues } from './schema';
import { getInitialValues } from './utils';

export function FormComponent({
  onSubmit,
  disabled,
  loading,
  initialValues: initialValuesProp,
  autoFocus,
}: {
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: FormValues;
  autoFocus?: boolean;
}) {
  const initialValues = useMemo(() => {
    return initialValuesProp || getInitialValues();
  }, [initialValuesProp]);

  return (
    <Form
      disabled={disabled}
      schema={schema}
      onSubmit={onSubmit}
      initialValues={initialValues}>
      {() => (
        <Flex direction="column" gap={0} maxWidth="300px">
          <Form.Field<number | undefined> name="grams">
            {fieldProps => {
              return (
                <Field {...fieldProps.field}>
                  <Field.Input>
                    <NumberInput
                      {...fieldProps.input}
                      append="грамм"
                      autoFocus={autoFocus}
                      required
                    />
                  </Field.Input>
                  <Field.Message />
                </Field>
              );
            }}
          </Form.Field>

          <Button disabled={disabled} loading={loading} type="submit">
            Сохранить
          </Button>
        </Flex>
      )}
    </Form>
  );
}
