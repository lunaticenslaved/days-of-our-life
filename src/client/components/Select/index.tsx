import { SelectContextProvider } from '#/client/components/Select/context';
import { SelectSingleProps, SelectSingle } from './SelectSingle';
import { SelectMultipleProps, SelectMultiple } from './SelectMultiple';

import { SelectOption } from './Option';
import { forwardRef } from 'react';

// TODO add area attributes

export type { SelectSingleProps, SelectMultipleProps };

export type SelectProps = SelectSingleProps | SelectMultipleProps;

const SelectWithRef = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, ...props },
  ref,
) {
  if (props.multiple) {
    return (
      <SelectContextProvider type="multiple" value={props.modelValue}>
        <SelectMultiple ref={ref} {...props}>
          {children}
        </SelectMultiple>
      </SelectContextProvider>
    );
  }

  return (
    <SelectContextProvider type="single" value={props.modelValue}>
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
