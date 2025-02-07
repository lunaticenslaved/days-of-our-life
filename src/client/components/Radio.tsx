import { DirectionProp, ModelValueProps } from '#/client/types';
import {
  ChangeEvent,
  createContext,
  HTMLProps,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  FocusEvent,
} from 'react';

//
//
// --- Radio Group Context ---
interface RadioGroupContext extends ModelValueProps<string | undefined> {
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
  onBlur?(e: FocusEvent<HTMLInputElement>): void;
}

const RadioGroupContext = createContext<RadioGroupContext | null>(null);

//
//
// --- Radio Group ---
// TODO add aria attributes
interface RadioGroupProps extends PropsWithChildren, DirectionProp, RadioGroupContext {}

function RadioGroup({
  children,
  direction = 'column',
  modelValue,
  onChange,
  onModelValueChange,
}: RadioGroupProps) {
  const [value, setValue] = useState(modelValue);

  useEffect(() => {
    setValue(modelValue);
  }, [modelValue]);

  return (
    <RadioGroupContext.Provider
      value={{
        modelValue: value,
        onChange,
        onModelValueChange: value => {
          onModelValueChange?.(value);
          setValue(value);
        },
      }}>
      <div style={{ display: 'flex', flexDirection: direction }}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

RadioGroup.displayName = 'RadioGroup';

//
//
// --- Radio Button ---
// TODO add aria attributes
interface RadioProps extends Omit<HTMLProps<HTMLInputElement>, 'value'>, DirectionProp {
  title?: string;
  value?: string;
}

function RadioButton({ title, direction = 'row', ...props }: RadioProps) {
  const context = useContext(RadioGroupContext);

  return (
    <label style={{ display: 'flex', flexDirection: direction }}>
      <input
        {...props}
        type="radio"
        checked={props.value === context?.modelValue}
        onChange={e => {
          props.onChange?.(e);
          context?.onChange?.(e);
          context?.onModelValueChange?.(props.value);
        }}
        onBlur={e => {
          props.onBlur?.(e);
          context?.onBlur?.(e);
        }}
      />
      {title && <span>{title}</span>}
    </label>
  );
}

RadioButton.displayName = 'RadioGroup.Button';

RadioGroup.Button = RadioButton;

export { RadioGroup };
