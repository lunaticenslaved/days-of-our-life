import { ModelValueProps } from '#/client/types';
import { HTMLProps } from 'react';

interface TextAreaProps
  extends HTMLProps<HTMLTextAreaElement>,
    ModelValueProps<string | undefined> {}

export function TextArea({ modelValue, onModelValueChange, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      value={modelValue ? String(modelValue) : ''}
      style={{ width: '100%', margin: 0, padding: 0 }}
      onChange={e => {
        const value = e.target.value;

        onModelValueChange?.(value);
        props.onChange?.(e);
      }}
    />
  );
}
