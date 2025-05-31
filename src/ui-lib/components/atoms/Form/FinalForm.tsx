import { ComponentProps, createContext, ReactNode, useContext, useMemo } from 'react';
import {
  Form as FinalForm,
  Field as FinalField,
  FormRenderProps,
  useForm,
  useFormState,
  FieldRenderProps,
} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Validator } from '#/shared/validation';
import { FieldContext, FieldState, InputFormFieldProps } from '#/ui-lib/types';
import { FieldArray } from 'react-final-form-arrays';
import { InputState } from '#/ui-lib/components/atoms/Input';
import { RefCallBack } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValidationErrors = Record<string, any>;

// --- Form Context -------------------------------------------------------
// TODO

// --- Form ---------------------------------------------------------------
interface FormProps<TFormValues> {
  schema?: Zod.ZodType<TFormValues>;
  validate?: (
    values: TFormValues,
  ) => Promise<FormValidationErrors> | FormValidationErrors;
  disabled?: boolean;
  initialValues: TFormValues;
  onSubmit(values: TFormValues): void | Promise<void>;
  children(props: FormRenderProps<TFormValues> & IFormContext): ReactNode;
}

function Form<TFormValues>({
  onSubmit,
  children,
  schema,
  initialValues,
  validate,
  disabled = false,
}: FormProps<TFormValues>) {
  const validator = useMemo(
    () => (schema ? new Validator(schema) : { validate }),
    [schema, validate],
  );

  return (
    <FinalForm<TFormValues>
      onSubmit={onSubmit}
      validate={validator.validate}
      initialValues={initialValues}
      mutators={{ ...arrayMutators }}>
      {formRenderProps => {
        const contextValue: IFormContext = { disabled };

        return (
          <FormContext.Provider value={contextValue}>
            <form onSubmit={formRenderProps.handleSubmit} style={{ display: 'contents' }}>
              {children({
                ...formRenderProps,
                ...contextValue,
              })}
            </form>
          </FormContext.Provider>
        );
      }}
    </FinalForm>
  );
}

Form.displayName = 'Form';

// --- Form Context ---------------------------------------------------------
interface IFormContext {
  disabled: boolean;
}
const FormContext = createContext<IFormContext | null>(null);

function useFormContext() {
  return useContext(FormContext);
}

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
  const getContextValue = useFieldContextValue<TValue>({
    required,
    name,
  });

  return (
    <FinalField<TValue>
      name={name}
      render={renderProps => {
        const childrenProps = getContextValue({
          meta: renderProps.meta,
          input: renderProps.input,
        });

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
Form.Field = Field;

// --- Field Array ----------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FieldArrayLocal<TValue = any>(
  props: ComponentProps<typeof FieldArray<TValue>> & {
    required?: boolean;
  },
) {
  const getContextValue = useFieldContextValue<TValue[]>({
    required: props.required || false,
    name: props.name,
  });

  return (
    <FieldArray
      {...props}
      render={renderProps => {
        const context = getContextValue({
          meta: renderProps.meta,
          input: {
            disabled: false,
            value: renderProps.fields.value,
            ref: undefined,
            onBlur: undefined,
          },
        });

        let content: ReactNode = null;

        if (props.render) {
          content = props.render?.(renderProps);
        } else if (typeof props.children === 'function') {
          content = props.children(renderProps);
        } else if (typeof props.children === 'object') {
          content = props.children;
        }

        return (
          <FormFieldContext.Provider value={context.field}>
            {content}
          </FormFieldContext.Provider>
        );
      }}
    />
  );
}
Form.displayName = 'Form.FieldArray';
Form.FieldArray = FieldArrayLocal;

// --- Other --------------------------------------------------------------

function useFieldContextValue<TValue>(arg: { required: boolean; name: string }) {
  const form = useForm();
  const formState = useFormState();

  const formContext = useFormContext();

  let fieldState: FieldState = 'valid';
  let inputState: InputState = 'valid';

  return (
    renderProps: Pick<FieldRenderProps<TValue, HTMLElement, TValue>, 'meta'> & {
      input: {
        disabled?: boolean;
        value: TValue;
        ref?: RefCallBack;
        onBlur?: (event?: React.FocusEvent<HTMLElement>) => void;
      };
    },
  ) => {
    if (renderProps.meta.error && renderProps.meta.touched) {
      fieldState = 'invalid';
      inputState = 'error';
    }

    const disabled = renderProps.input.disabled || formContext?.disabled || false;

    const childrenProps: InputFormFieldProps<TValue> = {
      form: {
        isValid: formState.valid,
      },
      field: {
        required: arg.required,
        name: arg.name,
        disabled,
        isDirty: renderProps.meta.dirty,
        isValidating: renderProps.meta.validating,
        isTouched: renderProps.meta.touched,
        error: renderProps.meta.error,
        state: fieldState,
      },
      input: {
        required: arg.required,
        state: inputState,
        value: renderProps.input.value,
        disabled,
        name: arg.name,
        ref: renderProps.input.ref,
        onChange: () => null,
        onBlur: renderProps.input.onBlur,
        onValueUpdate: newValue => {
          form.change(arg.name, newValue);
        },
      },
    };

    return childrenProps;
  };
}

export { Form, useFormFieldContext };
