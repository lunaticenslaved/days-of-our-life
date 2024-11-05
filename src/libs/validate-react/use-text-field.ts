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

type UseTextFieldProps = {
  name: string;
  value?: Value;
  onChange?: InputHTMLAttributes<Element>['onChange'];
  onBlur?: InputHTMLAttributes<Element>['onBlur'];
} & FormFieldProps<Value>;

export type TextFieldState = FormFieldState<
  Value,
  {
    type: 'text';
    name: string;
    value?: Value;
    error?: string | null;
    onChange?: InputHTMLAttributes<Element>['onChange'];
    onBlur?: InputHTMLAttributes<Element>['onBlur'];
  }
>;

export const useTextField = (props: UseTextFieldProps): TextFieldState => {
  const { rules, name, value: initialValue = '' } = props;

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<ValidationResult>(null);

  const onChange: ChangeEventHandler<Element> = useCallback(
    async event => {
      const { value } = event.target;

      setValue(value);
      setError(await validateValue(value, rules));

      if (props.onChange) {
        props.onChange(event);
      }
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
      type: 'text',
      onChange,
      onBlur,
      name,
      value,
      error,
    },
    isValid,
    value,
    clear: () => {
      setValue('');
    },
  };
};
