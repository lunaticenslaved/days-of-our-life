import { FFComponentProps, FField, FFieldExtendableProps } from './FField';

interface FFTextAreaProps extends FFieldExtendableProps {}

function Component(props: FFComponentProps<string | undefined, HTMLTextAreaElement>) {
  return <textarea {...props} />;
}

export const FFTextArea: React.FC<FFTextAreaProps> = props => {
  return (
    <FField<string | undefined, HTMLTextAreaElement> {...props} component={Component} />
  );
};
