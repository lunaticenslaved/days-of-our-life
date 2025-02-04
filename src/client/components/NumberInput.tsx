import { ModelValueProps } from '#/client/types';
import { HTMLProps, useCallback, useEffect, useState } from 'react';

interface NumberInputProps
  extends HTMLProps<HTMLInputElement>,
    ModelValueProps<number | undefined> {}

function convertInput(value?: string): { number?: number; string?: string } {
  if (!value) {
    return {
      number: undefined,
      string: '',
    };
  }

  if (value.startsWith('.')) {
    value = `0${value}`;
  }

  let valueArr = value.replace(/[^\d-\\.]/g, '').split('');

  // Leave minus if it is in the start
  const minusIndexes = valueArr
    .map((symbol, index) => (symbol === '-' ? index : -1))
    .filter(index => index > -1);

  for (const minusIndex of minusIndexes) {
    if (minusIndex === 0) {
      continue;
    }

    valueArr = valueArr.map((symbol, index) => (index === minusIndex ? '' : symbol));
  }

  // Leave only the first dot
  const dotIndexes = valueArr
    .map((symbol, index) => (symbol === '.' ? index : -1))
    .filter(index => index > -1);

  for (const dotIndex of dotIndexes.slice(1)) {
    valueArr = valueArr.map((symbol, index) => (index === dotIndex ? '' : symbol));
  }

  valueArr = valueArr.filter(Boolean);

  if (valueArr.length === 0) {
    return {
      string: '',
      number: undefined,
    };
  }

  return {
    number: Number(valueArr.join('')),
    string: valueArr.join(''),
  };
}

export function NumberInput({
  modelValue,
  onModelValueChange,
  ...props
}: NumberInputProps) {
  const [numberValue, setNumberValue] = useState(() => {
    return convertInput(String(modelValue)).number;
  });
  const [strValue, setStringValue] = useState(() => {
    return convertInput(String(modelValue)).string;
  });

  const setValue = useCallback(
    (newValue?: string) => {
      const { string, number } = convertInput(newValue);

      setNumberValue(number);
      setStringValue(string);
      onModelValueChange?.(number);
    },
    [onModelValueChange],
  );

  useEffect(() => {
    if (modelValue !== numberValue) {
      setStringValue(convertInput(String(modelValue)).string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelValue]);

  return (
    <input
      {...props}
      value={strValue}
      style={{ width: '100%', margin: 0, padding: 0 }}
      type="text"
      onChange={e => {
        setValue(e.target.value);
        props.onChange?.(e);
      }}
    />
  );
}
