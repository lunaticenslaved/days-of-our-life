import { SelectContextProvider } from './context';
import { SelectMultiple, SelectSingle, SelectOption } from './Select';

import { ComponentProps, forwardRef } from 'react';

// TODO add area attributes

type SelectSingleProps = ComponentProps<typeof SelectSingle>;
type SelectMultipleProps = ComponentProps<typeof SelectMultiple>;

export type { SelectSingleProps, SelectMultipleProps };

export type SelectProps = SelectSingleProps | SelectMultipleProps;

const SelectWithRef = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, ...props },
  ref,
) {
  if (props.multiple) {
    return (
      <SelectContextProvider
        type="multiple"
        value={props.value}
        onValueUpdate={props.onValueUpdate}>
        <SelectMultiple ref={ref} {...props}>
          {children}
        </SelectMultiple>
      </SelectContextProvider>
    );
  }

  return (
    <SelectContextProvider
      type="single"
      value={props.value}
      onValueUpdate={props.onValueUpdate}>
      <SelectSingle ref={ref} {...props}>
        {children}
      </SelectSingle>
    </SelectContextProvider>
  );
});

const Select = SelectWithRef as typeof SelectWithRef & {
  Option: typeof SelectOption;
};

Select.Option = SelectOption;

export { Select };
