import { z } from 'zod';
import {
  Controller,
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
  UseFormStateReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, ReactNode, useContext } from 'react';
import { FieldContext as IFieldContext, InputFormFieldProps } from '#/ui-lib/types';

// --- Form ------------------------------------------------------
function Form<TSchema extends Zod.SomeZodObject>({
  schema,
  onSubmit,
  children,
}: {
  schema: TSchema;
  onSubmit: (values: z.infer<TSchema>) => void;
  children: (arg: { form: UseFormReturn<z.infer<TSchema>> }) => ReactNode;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children({ form })}</form>
    </FormProvider>
  );
}

// --- Form Field ------------------------------------------------------
const FormFieldContext = createContext<IFieldContext | null>(null);

type FormFieldProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>,
> = Omit<ControllerProps<TFormValues, TName>, 'control' | 'render'> & {
  form: UseFormReturn<TFormValues>;
  children: (
    arg: InputFormFieldProps<FieldPathValue<TFormValues, TName>>,
  ) => ReturnType<ControllerProps<TFormValues, TName>['render']>;
};

function Field<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>,
>({ form, children, ...props }: FormFieldProps<TFormValues, TName>) {
  return (
    <Controller
      {...props}
      control={form.control}
      render={renderProps => {
        const childrenProps = getInputFormFieldProps({
          ...renderProps,
          form,
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

Form.displayName = 'Form';

Form.Field = Field;

function useFormFieldContext() {
  return useContext(FormFieldContext);
}

function getInputFormFieldProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>,
>({
  form,
  field,
  fieldState,
  formState,
}: {
  form: UseFormReturn<TFormValues>;
  field: ControllerRenderProps<TFormValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFormValues>;
}): InputFormFieldProps<FieldPathValue<TFormValues, TName>> {
  const fieldProps: IFieldContext = {
    required: false, // FIXME add real value
    name: field.name,
    disabled: field.disabled || false,
    isDirty: fieldState.isDirty,
    isValidating: fieldState.isValidating,
    isTouched: fieldState.isTouched,
    error: fieldState.error?.message,
    state: fieldState.error ? 'invalid' : 'valid',
  };

  return {
    field: fieldProps,
    form: {
      isValid: formState.isValid,
    },
    input: {
      onChange: () => null,
      onBlur: field.onBlur,
      value: field.value,
      disabled: field.disabled || false,
      name: field.name,
      ref: field.ref,
      onValueUpdate: newValue => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setValue(field.name, newValue as any, {
          shouldValidate: true,
          shouldDirty: true,
        });
      },
    },
  };
}

export { Form, useFormFieldContext };
