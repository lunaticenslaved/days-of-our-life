import { HTMLProps } from 'react';

interface TextInputProps extends HTMLProps<HTMLInputElement> {
  value?: string;
}

export function TextInput(props: TextInputProps) {
  return <input {...props} type="text" />;
}
