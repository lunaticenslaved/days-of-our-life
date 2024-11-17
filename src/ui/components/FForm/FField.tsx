import { ClassNameProp } from '#ui/types';
import { CSSProperties, ReactNode } from 'react';
import { Field, FieldInputProps } from 'react-final-form';

type FFChildrenProps<T, TE extends HTMLElement = HTMLElement> = FieldInputProps<T, TE>;

export interface FFieldProps<T, TE extends HTMLElement> extends ClassNameProp {
  children(props: FFChildrenProps<T, TE>): ReactNode;
  name: string;
  title?: string;
  required?: boolean;
  converter?: 'number';
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
  converter,
}: FFieldProps<T, TE>) {
  return (
    <Field
      name={name}
      parse={converter === 'number' ? v => (!v ? undefined : Number(v)) : undefined}>
      {({ input, meta }) => {
        return (
          <div style={style} className={className}>
            <label style={{ width: '100%' }}>
              <div>
                {title && <span>{title}</span>}
                {required && <span style={{ color: 'red' }}>*</span>}
              </div>
              <div style={{ width: '100%' }}>{children(input)}</div>
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
