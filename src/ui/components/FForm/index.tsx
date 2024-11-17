import { FField } from './FField';
import { FFieldArray } from './FFieldArray';

import { ReactNode, useMemo } from 'react';
import { FormState } from 'final-form';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Validator } from '#shared/validation';
import { ZodType, z } from 'zod';
import { Form as UIForm } from '../Form';

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
          <UIForm disabled={disabled} onSubmit={handleSubmit}>
            <div>{children({ values, errors })}</div>
            {loading && <div>Loading...</div>}
          </UIForm>
        );
      }}
    </Form>
  );
}

FForm.Field = FField;
FForm.FieldArray = FFieldArray;
