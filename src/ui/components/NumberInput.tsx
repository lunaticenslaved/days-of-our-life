import { HTMLProps } from 'react';

interface NumberInputProps extends HTMLProps<HTMLInputElement> {
  value?: string;
}

export function NumberInput(props: NumberInputProps) {
  return (
    <input
      {...props}
      type="number"
      onChange={e => {
        e.target.value = (Number(e.target.value) || undefined) as unknown as string;
        props.onChange?.(e);
      }}
    />
  );
}
