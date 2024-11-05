import { useMemo } from 'react';
import { FFComponentProps, FField, FFieldExtendableProps } from './FField';

const NO_VALUE = '__empty__';

interface OwnProps<T> {
  items: T[];
  getTitle(item: T): string;
  getValue(item: T): string;
}

interface FFSelectProps<T> extends FFieldExtendableProps, OwnProps<T> {}

function Component<T>({ items, getTitle, getValue }: OwnProps<T>) {
  return (props: FFComponentProps<string | undefined, HTMLSelectElement>) => {
    return (
      <select
        {...props}
        onChange={e => {
          const newValue = e.target.value;

          props.onChange(newValue === NO_VALUE ? undefined : newValue);
        }}>
        <option value={NO_VALUE}>{''}</option>
        {items.map(item => {
          const value = getValue(item);
          const title = getTitle(item);

          return (
            <option key={value} value={value}>
              {title}
            </option>
          );
        })}
      </select>
    );
  };
}

export function FFSelect<T>({ items, getTitle, getValue, ...props }: FFSelectProps<T>) {
  const component = useMemo(
    () => Component({ items, getTitle, getValue }),
    [getTitle, getValue, items],
  );

  return (
    <FField<string | undefined, HTMLSelectElement> {...props} component={component} />
  );
}
