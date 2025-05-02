import { createContext, ReactNode, useContext, useMemo } from 'react';
import {
  Form as FinalForm,
  Field as FinalField,
  FormRenderProps,
  useForm,
  useFormState,
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Validator } from '#/shared/validation';
import { z } from 'zod';
import { FieldContext, InputFormFieldProps } from '#/ui-lib/types';
import { FieldArray } from 'react-final-form-arrays';

// --- Form Context -------------------------------------------------------
// TODO

// --- Form ---------------------------------------------------------------
interface FormProps<TSchema extends Zod.SomeZodObject, TFormValues = z.infer<TSchema>> {
  schema: TSchema;
  disabled?: boolean; // TODO use in form context
  initialValues: TFormValues;
  onSubmit(values: TFormValues): void | Promise<void>;
  children(props: FormRenderProps<z.infer<TSchema>>): ReactNode;
}

function Form<TSchema extends Zod.SomeZodObject>({
  onSubmit,
  children,
  schema,
  initialValues,
}: FormProps<TSchema>) {
  type TFormValues = z.infer<TSchema>;

  const validator = useMemo(() => new Validator(schema), [schema]);

  return (
    <FinalForm<TFormValues>
      onSubmit={onSubmit}
      validate={validator.validate}
      initialValues={initialValues}
      mutators={{ ...arrayMutators }}>
      {formRenderProps => {
        return (
          <form onSubmit={formRenderProps.handleSubmit} style={{ display: 'contents' }}>
            {children(formRenderProps)}
          </form>
        );
      }}
    </FinalForm>
  );
}

Form.displayName = 'Form';

// --- Form Field Context ---------------------------------------------------
const FormFieldContext = createContext<FieldContext | null>(null);

function useFormFieldContext() {
  return useContext(FormFieldContext);
}

// --- Form Field -----------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Field<TValue = any>({
  name,
  required = false,
  children,
}: {
  name: string;
  required?: boolean;
  children: (props: InputFormFieldProps<TValue>) => ReactNode;
}) {
  const form = useForm();
  const formState = useFormState();

  return (
    <FinalField<TValue>
      name={name}
      render={renderProps => {
        const childrenProps: InputFormFieldProps<TValue> = {
          form: {
            isValid: formState.valid,
          },
          field: {
            required,
            name,
            disabled: renderProps.input.disabled || false, // FIXME add real value
            isDirty: renderProps.meta.dirty,
            isValidating: renderProps.meta.validating,
            isTouched: renderProps.meta.touched,
            error: renderProps.meta.error,
            state: renderProps.meta.error ? 'invalid' : 'valid',
          },
          input: {
            required,
            value: renderProps.input.value,
            disabled: renderProps.input.disabled || false,
            name: renderProps.input.name,
            ref: renderProps.input.ref,
            onChange: () => null,
            onBlur: renderProps.input.onBlur,
            onValueUpdate: newValue => {
              form.change(renderProps.input.name, newValue);
            },
          },
        };

        return (
          <FormFieldContext.Provider value={childrenProps.field}>
            {children(childrenProps)}
          </FormFieldContext.Provider>
        );
      }}
    />
  );
}

Field.displayName = 'Form.Field';

// --- Exports --------------------------------------------------------------
Form.Field = Field;
Form.FieldArray = FieldArray;

export { Form, useFormFieldContext };
