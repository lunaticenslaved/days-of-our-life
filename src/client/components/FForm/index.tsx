import { FField } from './FField';
import { FFieldArray } from './FFieldArray';

import { ReactNode, useMemo } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Validator } from '#/shared/validation';
import { ZodType, z } from 'zod';

interface FFormProps<V, T extends ZodType<V>, VZ extends z.infer<T>> {
  schema: T;
  disabled?: boolean;
  loading?: boolean;
  initialValues?: Partial<VZ>;
  onSubmit(values: VZ): void | Promise<void>;
  children(props: FormRenderProps<VZ> & { disabled?: boolean }): ReactNode;
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
      {data => {
        return (
          <form onSubmit={data.handleSubmit}>
            <div>{children({ ...data, disabled })}</div>
            {loading && <div>Loading...</div>}
          </form>
        );
      }}
    </Form>
  );
}

FForm.Field = FField;
FForm.FieldArray = FFieldArray;

export function FinalForm<V, T extends ZodType<V>, VZ extends z.infer<T>>({
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
      {children}
    </Form>
  );
}

FinalForm.Field = FField;
FinalForm.FieldArray = FFieldArray;
