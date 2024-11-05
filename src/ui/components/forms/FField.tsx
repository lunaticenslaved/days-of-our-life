import { ClassNameProp } from '#ui/types';
import { ComponentType, CSSProperties } from 'react';
import { Field, FieldInputProps } from 'react-final-form';

export interface FFComponentProps<T, TE extends HTMLElement = HTMLElement>
  extends Pick<FieldInputProps<T, TE>, 'onBlur' | 'value' | 'onChange' | 'name'> {}

export interface FFieldExtendableProps extends ClassNameProp {
  name: string;
  title?: string;
  required?: boolean;
  style?: CSSProperties;
}

export interface FFieldProps<T, TE extends HTMLElement> extends FFieldExtendableProps {
  component: ComponentType<FFComponentProps<T, TE>>;
}

export function FField<T, TE extends HTMLElement = HTMLElement>({
  name,
  title,
  component,
  required,
  style,
  className,
}: FFieldProps<T, TE>) {
  const Component = component;

  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <div style={style} className={className}>
            <label>
              <div>
                {title && <span>{title}</span>}
                {required && <span style={{ color: 'red' }}>*</span>}
              </div>
              <div>
                <Component
                  name={name}
                  onBlur={input.onBlur}
                  onChange={input.onChange}
                  value={input.value}
                />
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
