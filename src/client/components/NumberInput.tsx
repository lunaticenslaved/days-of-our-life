import { ModelValueProps } from '#/client/types';
import { HTMLProps } from 'react';

interface NumberInputProps
  extends HTMLProps<HTMLInputElement>,
    ModelValueProps<number | undefined> {}

export function NumberInput({
  modelValue,
  onModelValueChange,
  ...props
}: NumberInputProps) {
  return (
    <input
      {...props}
      value={modelValue ? String(modelValue) : undefined}
      style={{ width: '100%', margin: 0, padding: 0 }}
      type="number"
      onChange={e => {
        const value = Number(e.target.value);

        console.log(e.target.value?.length, value);

        if (isNaN(value)) {
          onModelValueChange?.(undefined);
        } else {
          onModelValueChange?.(value);
        }

        props.onChange?.(e);
      }}
    />
  );
}
