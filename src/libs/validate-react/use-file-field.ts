import {
  InputHTMLAttributes,
  ChangeEventHandler,
  FocusEventHandler,
  useState,
  useCallback,
} from 'react';
import { FormFieldState, FormFieldProps, ValidationResult, validateValue } from '#libs/validate';

type Value = File | undefined;

type UseFieldFieldProps = {
  name: string;
  value?: Value;
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
} & FormFieldProps<Value>;

type UseFieldFieldState = FormFieldState<
  Value,
  {
    type: 'file';
    name: string;
    error: string | null;
    value?: File;
    onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
    onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
  }
>;

export const useFileField = (props: UseFieldFieldProps): UseFieldFieldState => {
  const { rules, name, value: initialValue } = props;

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<ValidationResult>(null);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    async event => {
      if (props.onChange) {
        props.onChange(event);
      }

      const file = event.target.files?.[0];

      setValue(file);
      setError(await validateValue(file, rules));
    },
    [props, rules],
  );

  const onBlur: FocusEventHandler<HTMLInputElement> = useCallback(
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
      type: 'file',
      onChange,
      onBlur,
      name,
      value,
      error,
    },
    value,
    isValid,
    clear: () => setValue(undefined),
  };
};
