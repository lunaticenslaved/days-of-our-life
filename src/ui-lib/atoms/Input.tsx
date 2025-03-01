import { InputProps as BaseInputProps } from '#/ui-lib/types';
import { getSize } from '#/ui-lib/utils/size';
import {
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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
          height: '100%',
          width: '100%',
          padding: getSize(2),
          outlineWidth: '0',
          margin: '0',
          border: 'none',
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
