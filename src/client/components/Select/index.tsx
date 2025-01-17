import { SelectContextProvider } from '#/client/components/Select/context';
import { SelectSingleProps, SelectSingle } from './SelectSingle';
import { SelectMultipleProps, SelectMultiple } from './SelectMultiple';

import { SelectOption } from './Option';
import { forwardRef } from 'react';

// TODO add area attributes

export type { SelectSingleProps, SelectMultipleProps };

export type SelectProps = SelectSingleProps | SelectMultipleProps;

const SelectWithRef = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  children,
  ...props
}) {
  if (props.multiple) {
    return (
      <SelectContextProvider type="multiple">
        <SelectMultiple {...props}>{children}</SelectMultiple>
      </SelectContextProvider>
    );
  }

  return (
    <SelectContextProvider type="single">
      <SelectSingle {...props}>{children}</SelectSingle>
    </SelectContextProvider>
  );
});

const Select = SelectWithRef as typeof SelectWithRef & {
  Option: typeof SelectOption;
};

Select.Option = SelectOption;

export { Select };
