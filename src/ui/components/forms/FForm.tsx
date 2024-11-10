import { ReactNode, useMemo } from 'react';
import { FormState } from 'final-form';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Button } from '#ui/components/Button';
import { Validator } from '#shared/validation';
import { ZodType, z } from 'zod';

interface ChildrenProps<T> extends Pick<FormState<T>, 'values' | 'errors'> {}

interface FFormProps<V, T extends ZodType<V>, VZ extends z.infer<T>> {
  schema: T;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: Partial<VZ>;
  onSubmit(values: VZ): void;
  children(props: ChildrenProps<VZ>): ReactNode;
}

export function FForm<V, T extends ZodType<V>, VZ extends z.infer<T>>({
  disabled,
  loading,
  onSubmit,
  children,
  schema,
  initialValues,
}: FFormProps<V, T, VZ>) {
  const validator = useMemo(() => new Validator(schema), [schema]);

  return (
    <Form<VZ>
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
