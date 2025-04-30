import { Input } from '#/ui-lib/atoms/Input/Input';
import { WithInputProps } from '#/ui-lib/types';
import { ComponentProps, useCallback, useEffect, useState } from 'react';

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

  while (value.startsWith('0') && value[1] && value[1] !== '.') {
    value = value.slice(1);
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

type NumberInputProps = WithInputProps<number | undefined, ComponentProps<typeof Input>>;

export function NumberInput(props: NumberInputProps) {
  const valueProp = props.value;
  const onValueUpdate = props.onValueUpdate;

  const [numberValue, setNumberValue] = useState(() => {
    return convertInput(String(valueProp)).number;
  });
  const [strValue, setStringValue] = useState(() => {
    return convertInput(String(valueProp)).string;
  });

  const setValue = useCallback(
    (newValue?: string) => {
      const { string, number } = convertInput(newValue);

      setNumberValue(number);
      setStringValue(string);
      onValueUpdate?.(number || undefined);
    },
    [onValueUpdate],
  );

  useEffect(() => {
    if (valueProp !== numberValue) {
      setStringValue(convertInput(String(valueProp)).string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  return (
    <Input
      {...props}
      onValueUpdate={setValue}
      value={strValue}
      convertValue={newValue => {
        return convertInput(newValue).string;
      }}
    />
  );
}
