import { DirectionProp } from '#/client/types';
import { WithInputProps } from '#/ui-lib/types';
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

// --- Radio Group Context ------------------------------------------------------------
type RadioGroupContext = WithInputProps<
  string | undefined,
  {
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
    onBlur?(e: FocusEvent<HTMLInputElement>): void;
  }
>;

const RadioGroupContext = createContext<RadioGroupContext | null>(null);

// --- Radio Group --------------------------------------------------------------------
// TODO add aria attributes
// TODO and on blur event
function RadioGroup({
  children,
  direction = 'column',
  value: valueProp,
  onChange,
  onValueUpdate,
}: PropsWithChildren & DirectionProp & RadioGroupContext) {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        onChange,
        onValueUpdate: value => {
          onValueUpdate?.(value);
          setValue(value);
        },
      }}>
      <div style={{ display: 'flex', flexDirection: direction }}>{children}</div>
    </RadioGroupContext.Provider>
  );
}
RadioGroup.displayName = 'RadioGroup';

// --- Radio Button ------------------------------------------------------------------
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
        checked={props.value === context?.value}
        onChange={e => {
          props.onChange?.(e);
          context?.onChange?.(e);
          context?.onValueUpdate?.(props.value);
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
