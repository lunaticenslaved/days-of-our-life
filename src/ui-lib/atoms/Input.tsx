import { THEME } from '#/ui-lib/theme';
import { InputProps as BaseInputProps } from '#/ui-lib/types';
import { getDimensions } from '#/ui-lib/utils/dimensions';
import { Size } from '#/ui-lib/utils/size';
import { getSpacingStyles } from '#/ui-lib/utils/spacing';
import {
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const SIZE: Size = 'm';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps> &
  BaseInputProps<string | null> & {
    debounceMs?: number;
    convertValue?: (value: string | null) => string | undefined;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ debounceMs = 0, value, onValueUpdate, convertValue, ...props }, ref) => {
    const [localValue, _setLocalValue] = useState(() => {
      return convertValue ? convertValue(value) : value;
    });

    const setLocalValue = useCallback(
      (newValue: string = '') => {
        _setLocalValue(convertValue ? convertValue(newValue) : newValue);
      },
      [convertValue],
    );

    useDebounce(
      () => {
        onValueUpdate?.(localValue || '');
      },
      [localValue],
      {
        ms: debounceMs,
      },
    );

    return (
      <input
        ref={ref}
        {...props}
        style={{
          height: getDimensions(THEME.components.input.height[SIZE]),
          borderRadius: getDimensions(THEME.components.input.borderRadius[SIZE]),
          width: '100%',
          outlineWidth: '0',
          border: 'none',
          ...getSpacingStyles(THEME.components.input.spacing[SIZE]),
          ...props.style,
        }}
        value={localValue || ''}
        onChange={e => {
          setLocalValue(e.target.value);
          props.onChange?.(e);
        }}
      />
    );
  },
);

function useDebounce(
  cb: () => void,
  deps: unknown[],
  options: {
    ms: number;
  },
) {
  const isMountedRef = useRef(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (isMountedRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (options.ms > 0) {
        timeoutRef.current = setTimeout(cb, options.ms) as unknown as number;
      } else {
        cb();
      }
    }

    isMountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
