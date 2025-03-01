import { Field } from '#/ui-lib/atoms/Field';
import { Input } from '#/ui-lib/atoms/Input';
import { InputFieldProps } from '#/ui-lib/types';

type TextInputFieldProps = InputFieldProps<string | null> & {
  label: string;
  required?: boolean;
};

export function TextInputField({ label, ...props }: TextInputFieldProps) {
  return (
    <Field {...props.field}>
      <Field.Label>{label}</Field.Label>
      <Field.Input>
        <Input
          {...props.input}
          onValueUpdate={newValue => {
            props.input.onValueUpdate(newValue || '');
          }}
        />
      </Field.Input>
      <Field.Message />
    </Field>
  );
}
