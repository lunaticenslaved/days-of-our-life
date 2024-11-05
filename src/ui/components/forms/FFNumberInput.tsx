import { FFComponentProps, FField, FFieldExtendableProps } from './FField';

interface FFNumberInputProps extends FFieldExtendableProps {}

function Component(props: FFComponentProps<string | undefined, HTMLInputElement>) {
  return (
    <input
      {...props}
      type="number"
      onChange={e => {
        const newValue = Number(e.target.value);
        props.onChange(isNaN(newValue) ? undefined : newValue);
      }}
    />
  );
}

export const FFNumberInput: React.FC<FFNumberInputProps> = props => {
  return (
    <FField<string | undefined, HTMLInputElement> {...props} component={Component} />
  );
};
