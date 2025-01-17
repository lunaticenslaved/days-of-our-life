import { HTMLProps } from 'react';

interface SelectOptionProps extends HTMLProps<HTMLOptionElement> {}

export function SelectOption(props: SelectOptionProps) {
  return <option {...props} />;
}
