import { ReactNode, useMemo } from 'react';
import { FormState } from 'final-form';
import { Form, FormProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Button } from '#ui/components/Button';
import { Validator } from '#shared/validation';
import { ZodObject } from 'zod';

interface ChildrenProps<T> extends Pick<FormState<T>, 'values' | 'errors'> {}

interface FFormProps<T> extends Pick<FormProps<T>, 'initialValues'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodObject<any>;
  disabled?: boolean;
  loading?: boolean;
  onSubmit(values: T): void;
  children(props: ChildrenProps<T>): ReactNode;
}

export function FForm<T>({
  disabled,
  loading,
  onSubmit,
  children,
  schema,
  initialValues,
}: FFormProps<T>) {
  const validator = useMemo(() => new Validator(schema), [schema]);

  return (
    <Form
      onSubmit={onSubmit}
      validate={validator.validate}
      initialValues={initialValues}
      mutators={{ ...arrayMutators }}>
      {({ values, errors, handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div>{children({ values, errors })}</div>
            {loading && <div>Loading...</div>}
            <Button disabled={disabled} type="submit">
              Отправить
            </Button>
          </form>
        );
      }}
    </Form>
  );
}
