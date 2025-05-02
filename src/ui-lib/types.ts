import { CSSProperties } from 'react';
import { Noop, RefCallBack } from 'react-hook-form';

export interface ClassNameProp {
  className?: string;
}

export interface StyleProp {
  style?: CSSProperties;
}

// --- Input ------------------------------------------------
// FIXME it value props. Input props are with onBlur etc
export interface InputProps<TValue = unknown> {
  value: TValue;
  onValueUpdate: (newValue: TValue) => void;
}

export type WithInputProps<TValue = unknown, T extends object = object> = Partial<
  InputProps<TValue>
> &
  Omit<T, keyof InputProps>;

// --- Field ------------------------------------------------
export type FieldState = 'valid' | 'invalid';
export type FieldDirection = 'vertical' | 'horizontal';

// FIXME it form field context!
export interface FieldContext {
  required?: boolean; // FIXME No need
  direction?: FieldDirection;
  state?: FieldState;
  name?: string;
  error?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isValidating?: boolean;
  disabled?: boolean;
}

export type InputFieldProps<TValue> = {
  field: FieldContext;
  input: Required<InputProps<TValue>> & {
    required: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (...event: any[]) => void;
    onBlur?: Noop;
    disabled?: boolean;
    name?: string;
    ref?: RefCallBack;
  };
};

export type InputFormFieldProps<TValue> = InputFieldProps<TValue> & {
  form: {
    isValid: boolean;
  };
};
