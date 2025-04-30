import { DirectionProp } from '#/client/types';
import { Box } from '#/ui-lib/components/atoms/Box';
import { Flex } from '#/ui-lib/components/atoms/Flex';
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
  ReactNode,
} from 'react';

// --- Radio Group Context ------------------------------------------------------------
type RadioGroupContext<TValue extends string = string> = WithInputProps<
  TValue | undefined,
  {
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
    onBlur?(e: FocusEvent<HTMLInputElement>): void;
  }
>;

const RadioGroupContext = createContext<RadioGroupContext | null>(null);

// --- Radio Group --------------------------------------------------------------------
// TODO add aria attributes
// TODO and on blur event
function RadioGroup<TValue extends string>({
  children,
  direction = 'column',
  value: valueProp,
  onChange,
  onValueUpdate,
}: PropsWithChildren & DirectionProp & RadioGroupContext<TValue>) {
  const [value, setValue] = useState<TValue | undefined>(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        onChange,
        onValueUpdate: value => {
          onValueUpdate?.(value as TValue);
          setValue(value as TValue);
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
  value?: string;
  children: ReactNode;
}

function RadioButton({ direction = 'row', children, ...props }: RadioProps) {
  const context = useContext(RadioGroupContext);

  return (
    <label>
      <Flex direction={direction} gap={1} alignItems="center">
        <input
          {...props}
          style={{
            margin: 0,
            cursor: 'pointer',
            ...props.style,
          }}
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
        {/* FIXME use cursor styles */}
        <Box maxWidth="max-content" style={{ cursor: 'pointer' }}>
          {children}
        </Box>
      </Flex>
    </label>
  );
}
RadioButton.displayName = 'RadioGroup.Button';
RadioGroup.Button = RadioButton;

export { RadioGroup };
