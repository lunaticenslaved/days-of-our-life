import {
  InputHTMLAttributes,
  ChangeEventHandler,
  FocusEventHandler,
  useState,
  useCallback,
} from 'react';
import { FormFieldState, FormFieldProps, ValidationResult, validateValue } from '#libs/validate';

type Value = string;
type Element = HTMLInputElement | HTMLTextAreaElement;

type UsePasswordFieldProps = {
  name: string;
  value?: Value;
  onChange?: InputHTMLAttributes<Element>['onChange'];
  onBlur?: InputHTMLAttributes<Element>['onBlur'];
} & FormFieldProps<Value>;

export type PasswordFieldState = FormFieldState<
  Value,
  {
    type: 'password';
    name: string;
    value?: Value;
    error?: string | null;
    onChange?: InputHTMLAttributes<Element>['onChange'];
    onBlur?: InputHTMLAttributes<Element>['onBlur'];
  }
>;

export const usePasswordField = (props: UsePasswordFieldProps): PasswordFieldState => {
  const { rules, name, value: initialValue = '' } = props;

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<ValidationResult>(null);

  const onChange: ChangeEventHandler<Element> = useCallback(
    async event => {
      if (props.onChange) {
        props.onChange(event);
      }

      const { value } = event.target;

      setValue(value);
      setError(await validateValue(value, rules));
    },
    [props, rules],
  );

  const onBlur: FocusEventHandler<Element> = useCallback(
    async event => {
      if (props.onBlur) {
        props.onBlur(event);
      }

      setError(await validateValue(value, rules));
    },
    [props, rules, value],
  );

  const isValid = useCallback(async () => {
    const err = await validateValue(value, rules);
    setError(err);

    return !err;
  }, [value, rules]);

  return {
    props: {
      type: 'password',
      onChange,
      onBlur,
      name,
      value,
      error,
    },
    isValid,
    value,
    clear: () => setValue(''),
  };
};
