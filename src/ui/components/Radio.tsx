import { DirectionProp } from '#ui/types';
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

interface RadioGroupContext {
  value?: string;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
  onBlur?(e: FocusEvent<HTMLInputElement>): void;
}

const RadioGroupContext = createContext<RadioGroupContext | null>(null);

// TODO add aria attributes

interface RadioProps extends HTMLProps<HTMLInputElement>, DirectionProp {
  title?: string;
}

export function Radio({ title, direction = 'row', ...props }: RadioProps) {
  const context = useContext(RadioGroupContext);

  return (
    <label style={{ display: 'flex', flexDirection: direction }}>
      <input
        {...props}
        type="radio"
        checked={props.value === context?.value}
        onChange={e => {
          props.onChange?.(e);
          context?.onChange?.(e);
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

// TODO add aria attributes

interface RadioGroupProps extends PropsWithChildren, DirectionProp, RadioGroupContext {}

function RadioGroup({
  children,
  direction = 'column',
  value: valueProp,
  onChange,
}: RadioGroupProps) {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        onChange: e => {
          onChange?.(e);
          setValue(e.target.value);
        },
      }}>
      <div style={{ display: 'flex', flexDirection: direction }}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

Radio.Group = RadioGroup;
