import { ClassNameProp } from '#ui/types';
import { CSSProperties, ReactNode } from 'react';
import { Field, FieldInputProps } from 'react-final-form';

export type FFChildrenProps<T, TE extends HTMLElement = HTMLElement> = FieldInputProps<
  T,
  TE
>;

export interface FFieldExtendableProps extends ClassNameProp {
  name: string;
  title?: string;
  required?: boolean;
  converter?: 'number';
  style?: CSSProperties;
}

export interface FFieldProps<T, TE extends HTMLElement> extends FFieldExtendableProps {
  children(props: FFChildrenProps<T, TE>): ReactNode;
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
            <label>
              <div>
                {title && <span>{title}</span>}
                {required && <span style={{ color: 'red' }}>*</span>}
              </div>
              <div>{children(input)}</div>
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
