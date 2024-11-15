import { HTMLProps } from 'react';

interface TextAreaProps extends HTMLProps<HTMLTextAreaElement> {}

export function TextArea(props: TextAreaProps) {
  return <textarea {...props} />;
}
