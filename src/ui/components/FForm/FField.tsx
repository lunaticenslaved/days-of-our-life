import { ClassNameProp, ModelValueProps } from '#ui/types';
import { CSSProperties, ReactNode } from 'react';
import { Field, FieldInputProps, useForm } from 'react-final-form';

type FFChildrenProps<T, TE extends HTMLElement = HTMLElement> = FieldInputProps<T, TE> &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ModelValueProps<any>;

export interface FFieldProps<T, TE extends HTMLElement> extends ClassNameProp {
  children(props: FFChildrenProps<T, TE>): ReactNode;
  name: string;
  title?: string;
  required?: boolean;
  style?: CSSProperties;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FField<T = any, TE extends HTMLElement = HTMLElement>({
  name,
  title,
  children,
  required,
  style,
  className,
}: FFieldProps<T, TE>) {
  const form = useForm();

  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <div style={style} className={className}>
            <label style={{ width: '100%' }}>
              <div>
                {title && <span>{title}</span>}
                {required && <span style={{ color: 'red' }}>*</span>}
              </div>
              <div style={{ width: '100%' }}>
                {children({
                  ...input,
                  onChange: () => null,
                  modelValue: input.value,
                  onModelValueChange: v => form.change(name, v),
                })}
              </div>
            </label>
            <div style={{ height: '20px', marginBottom: '10px' }}>
              {meta.touched && meta.error}
            </div>
          </div>
        );
      }}
    </Field>
  );
}
