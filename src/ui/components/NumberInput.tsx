import { HTMLProps } from 'react';

interface NumberInputProps extends HTMLProps<HTMLInputElement> {
  value?: string;
}

export function NumberInput(props: NumberInputProps) {
  return (
    <input
      {...props}
      style={{ width: '100%', margin: 0, padding: 0 }}
      type="number"
      onChange={e => {
        props.onChange?.(e);
      }}
    />
  );
}
