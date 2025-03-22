import { ModelValueProps } from '#/client/types';
import { HTMLProps } from 'react';

interface TextInputProps
  extends Omit<HTMLProps<HTMLInputElement>, keyof ModelValueProps>,
    ModelValueProps<string | undefined> {}

export function TextInput({ modelValue, onModelValueChange, ...props }: TextInputProps) {
  return (
    <input
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
