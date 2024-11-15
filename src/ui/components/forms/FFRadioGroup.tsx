import { useMemo } from 'react';
import { FFComponentProps, FField, FFieldExtendableProps } from './FField';

interface OwnProps {
  name: string;
  options: Array<{
    title: string;
    value: string;
  }>;
}

interface FFRadioGroupProps extends FFieldExtendableProps, OwnProps {}

function Component({ options, name }: OwnProps) {
  return (props: FFComponentProps<string | undefined, HTMLInputElement>) => {
    return (
      <div>
        {options.map(({ title, value }) => {
          return (
            <div key={value}>
              <label>
                <input
                  {...props}
                  type="radio"
                  name={name}
                  value={value}
                  checked={value === props.value}
                />
                <span>{title}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  };
}

export function FFRadioGroup({ options, ...props }: FFRadioGroupProps) {
  const component = useMemo(
    () => Component({ options, name: props.name }),
    [options, props.name],
  );

  return <FField {...props} component={component} />;
}
