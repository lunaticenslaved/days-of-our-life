import { ModelValueProps } from '#/client/types';
import { useNullableFieldContext } from '#/ui-lib/atoms/Field';
import { getSize } from '#/ui-lib/utils/size';
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
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

  const fieldContext = useNullableFieldContext();

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
      id={props.id || fieldContext?.id}
      style={{
        height: getSize(10),
        padding: getSize(2),
        borderRadius: getSize(1),
      }}
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
