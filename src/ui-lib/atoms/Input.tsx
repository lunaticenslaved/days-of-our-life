import { ModelValueProps } from '#/client/types';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';

type InputProps = HTMLAttributes<HTMLInputElement> &
  ModelValueProps<string | undefined> & {
    debounceMs?: number;
  };

export function Input({
  debounceMs = 0,
  modelValue,
  onModelValueChange,
  ...props
}: InputProps) {
  const [localValue, setLocalValue] = useState(modelValue);

  useEffect(() => {
    setLocalValue(modelValue);
  }, [modelValue]);

  useDebounce(
    () => {
      onModelValueChange?.(localValue);
    },
    [localValue],
    {
      ms: debounceMs,
    },
  );

  return (
    <input
      {...props}
      value={localValue || ''}
      onChange={e => {
        setLocalValue(e.target.value || undefined);
        props.onChange?.(e);
      }}
    />
  );
}

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
