import { WithInputProps } from '#/ui-lib/types';
import { HTMLProps } from 'react';

type TextAreaProps = WithInputProps<string | undefined, HTMLProps<HTMLTextAreaElement>>;

// TODO добавить стили

export function TextArea({ value, onValueUpdate, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      value={value ? String(value) : ''}
      style={{ width: '100%', margin: 0, padding: 0 }}
      onChange={e => {
        const value = e.target.value;

        onValueUpdate?.(value);
        props.onChange?.(e);
      }}
    />
  );
}
